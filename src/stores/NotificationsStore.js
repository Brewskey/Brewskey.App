// @flow

import type { AchievementType, EntityID } from 'brewskey.js-api';
import type { ObservableMap } from 'mobx';
import type { Navigation } from '../types';

import { AppState, AsyncStorage } from 'react-native';
import {
  action,
  computed,
  observable,
  reaction,
  runInAction,
  when,
} from 'mobx';
import nullthrows from 'nullthrows';
import FCM, { FCMEvent } from 'react-native-fcm';
import DeviceInfo from 'react-native-device-info';
import AuthStore from './AuthStore';
import { AchievementStore, KegStore } from './DAOStores';
import { fetchJSON } from './ApiRequestStores/makeRequestApiStore';
import CONFIG from '../config';

const BASE_PUSH_URL = `${CONFIG.HOST}api/v2/push`;

const NOTIFICATIONS_STORAGE_KEY = 'notifications';

export type BaseNotification<TNotificationExtraProps: {}> = {
  ...TNotificationExtraProps,
  body: string,
  date: Date,
  id: string,
  isRead: string,
  title: string,
};

export type LowKegLevelNotificationExtraProps = {
  beverageId: EntityID,
  beverageName: string,
  tapId: EntityID,
  type: 'lowKegLevel',
};

export type NewAchievementNotificationExtraProps = {
  achievementType: AchievementType,
  type: 'newAchievement',
};

export type NewFriendRequestNotificationExtraProps = {
  friendId: EntityID,
  type: 'newFriendRequest',
  friendUserName: string,
};

export type LowKegLevelNotification = BaseNotification<
  LowKegLevelNotificationExtraProps,
>;

export type NewAchievementNotification = BaseNotification<
  NewAchievementNotificationExtraProps,
>;

export type NewFriendRequestNotification = BaseNotification<
  NewFriendRequestNotificationExtraProps,
>;

export type Notification =
  | LowKegLevelNotification
  | NewAchievementNotification
  | NewFriendRequestNotification;

class NotificationsStore {
  @observable _navigation: ?Navigation = null;
  @observable
  _notificationsByID: ObservableMap<BaseNotification<any>> = observable.map();

  constructor() {
    AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        FCM.removeAllDeliveredNotifications();
      }
    });

    FCM.on(FCMEvent.Notification, this._onRawNotification);

    (async () => {
      await this._rehydrateNotifications();

      reaction(
        () => this._notificationsByID.values(),
        notifications => {
          AsyncStorage.setItem(
            NOTIFICATIONS_STORAGE_KEY,
            JSON.stringify(notifications),
          );
        },
        {
          compareStructural: true,
        },
      );
    })();
  }

  @computed
  get notifications(): Array<Notification> {
    return this._notificationsByID
      .values()
      .sort((a, b): number => new Date(b.date) - new Date(a.date));
  }

  @computed
  get unreadCount(): number {
    return this._notificationsByID
      .values()
      .filter(({ isRead }: Notifications) => !isRead).length;
  }

  @computed
  get hasUnread(): boolean {
    return this.unreadCount > 0;
  }

  @computed
  get _isInitialized(): boolean {
    return !!this._navigation && AuthStore.isAuthorized;
  }

  handleInitialNotification = async () => {
    // handle case when the app is killed and we launch it by clicking
    // on incoming notifications.
    const initialNotification = await FCM.getInitialNotification();
    initialNotification && this._onRawNotification(initialNotification);
  };

  registerToken = async () => {
    const fcmToken = await FCM.getFCMToken();
    const deviceUniqueID = DeviceInfo.getUniqueID();

    await fetchJSON(`${BASE_PUSH_URL}/register`, {
      body: JSON.stringify({
        deviceToken: fcmToken,
        installationId: deviceUniqueID,
        platform: 'fcm',
      }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${AuthStore.token || ''}`,
        'Content-Type': 'application/json',
      },
      method: 'post',
    });
  };

  unregisterToken = () =>
    fetchJSON({
      method: 'post',
      url: `${BASE_PUSH_URL}/unregister`,
    });

  onNotificationPress = async (notification: Notification): Promise<void> => {
    await this._waitForInitializationFinish();
    this._handleNotificationPressByType(notification);
  };

  @action
  setNavigation = (navigation: Navigation) => {
    this._navigation = navigation;
  };

  @action deleteAll = () => this._notificationsByID.clear();

  @action deleteByID = (id: string) => this._notificationsByID.delete(id);

  @action
  setRead = (notificationID: string) => {
    const notification = this._notificationsByID.get(notificationID);
    if (!notification) {
      return;
    }

    this._notificationsByID.set(notificationID, {
      ...notification,
      isRead: true,
    });
  };

  @action
  _addNotification = (notification: Notification): void =>
    this._notificationsByID.set(notification.id, notification);

  _rehydrateNotifications = async () => {
    const notificationsString = await AsyncStorage.getItem(
      NOTIFICATIONS_STORAGE_KEY,
    );

    const notifications = notificationsString
      ? JSON.parse(notificationsString).map(notification => [
          notification.id,
          notification,
        ])
      : [];

    runInAction(() => {
      this._notificationsByID.merge((notifications: any));
    });
  };

  _waitForInitializationFinish = (): Promise<void> =>
    new Promise((resolve: () => void) => {
      if (this._isInitialized) {
        resolve();
        return;
      }
      when(() => this._isInitialized, () => resolve());
    });

  _onRawNotification = rawNotification => {
    // ignore empty callbackNotification call when open the app
    // from main icon when the app is in background currently
    if (rawNotification.fcm.action === 'android.intent.action.MAIN') {
      return;
    }

    const parsedNotification = rawNotification.custom_notification
      ? JSON.parse(rawNotification.custom_notification)
      : rawNotification;

    const existingNotification = this._notificationsByID.get(
      parsedNotification.id,
    );

    const openedFromTray = !!parsedNotification.opened_from_tray;

    this._addNotification({
      ...parsedNotification,
      date: existingNotification ? existingNotification.date : new Date(),
      isRead: openedFromTray,
    });

    if (openedFromTray) {
      this.onNotificationPress(parsedNotification);
    }
  };

  _handleNotificationPressByType = (notification: Notification) => {
    switch (notification.type) {
      case 'lowKegLevel': {
        const { tapId }: LowKegLevelNotification = (notification: any);
        KegStore.flushCache();
        nullthrows(this._navigation).navigate('tapDetails', {
          id: tapId,
        });
        break;
      }
      case 'newAchievement': {
        AchievementStore.flushCache();
        nullthrows(this._navigation).navigate('myProfile');
        break;
      }
      case 'newFriendRequest': {
        nullthrows(this._navigation).navigate('myFriendsRequest');
        break;
      }
      default: {
        break;
      }
    }
  };
}

export default new NotificationsStore();
