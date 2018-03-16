// @flow

import type { AchievementType, EntityID } from 'brewskey.js-api';
import type { ObservableMap } from 'mobx';
import type { Navigation } from '../types';

import { AppState } from 'react-native';
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
import Storage from '../Storage';
import { AchievementStore, KegStore } from './DAOStores';
import CONFIG from '../config';

const BASE_PUSH_URL = `${CONFIG.HOST}api/v2/push`;

const NOTIFICATIONS_STORAGE_KEY = 'notifications';

type BaseNotificationProps = {
  body: string,
  date: Date,
  id: string,
  isRead: string,
  title: string,
};

export type LowKegLevelNotification = BaseNotificationProps & {
  beverageId: EntityID,
  beverageName: string,
  tapId: EntityID,
  type: 'lowKegLevel',
};

export type NewAchievementNotification = BaseNotificationProps & {
  achievementType: AchievementType,
  type: 'newAchievement',
};

export type NewFriendRequestNotification = BaseNotificationProps & {
  friendId: EntityID,
  friendUserName: string,
  type: 'newFriendRequest',
};

export type Notification =
  | LowKegLevelNotification
  | NewAchievementNotification
  | NewFriendRequestNotification;

class NotificationsStore {
  @observable _navigation: ?Navigation = null;
  @observable
  _notificationsByID: ObservableMap<Notification> = observable.map();

  constructor() {
    AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        FCM.removeAllDeliveredNotifications();
      }
    });

    FCM.on(FCMEvent.Notification, this._onRawNotification);
    this.registerToken();

    (async () => {
      await this._rehydrateNotifications();

      reaction(
        () => this._notificationsByID.values(),
        (notifications: Array<Notification>) => {
          if (!AuthStore.isAuthorized) {
            return;
          }
          Storage.setForCurrentUser(NOTIFICATIONS_STORAGE_KEY, notifications);
        },
        ({
          compareStructural: true,
        }: any),
      );
    })();
  }

  @computed
  get notifications(): Array<Notification> {
    return Array.from(this._notificationsByID.values()).sort(
      (a: Notification, b: Notification): number =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  @computed
  get unreadCount(): number {
    return Array.from(this._notificationsByID.values()).filter(
      ({ isRead }: Notification) => !isRead,
    ).length;
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
    // the timeout is a workaround to avoid the warning:
    // "Tried to use permissions API while not attached to an Activity"
    // https://github.com/facebook/react-native/blob/master/ReactAndroid/src/main/java/com/facebook/react/modules/permissions/PermissionsModule.java
    // https://github.com/facebook/react-native/issues/13439
    // it appears sometimes because of race conditions between native/js thread probably.
    // they use timeout even in react-native-fcm example app :(
    // https://github.com/evollu/react-native-fcm/blob/master/Examples/simple-fcm-client/app/App.js#L44
    setTimeout(async () => {
      const initialNotification = await FCM.getInitialNotification();
      initialNotification && this._onRawNotification(initialNotification);
    }, 500);
  };

  registerToken = async () => {
    const fcmToken = await FCM.getFCMToken();
    const deviceUniqueID = DeviceInfo.getUniqueID();

    // eslint-disable-next-line
    await fetch(`${BASE_PUSH_URL}/`, {
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
      method: 'PUT',
    });
  };

  unregisterToken = () =>
    // eslint-disable-next-line
    fetch(`${BASE_PUSH_URL}/${DeviceInfo.getUniqueID()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });

  onLogin = () => {
    this.registerToken();
    this._rehydrateNotifications();
  };

  onLogout = () => {
    this.unregisterToken();
    this.deleteAll();
  };

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

    this._notificationsByID.set(
      notificationID,
      ({
        ...notification,
        isRead: true,
      }: any),
    );
  };

  @action
  _addNotification = (notification: Notification): void =>
    this._notificationsByID.set(notification.id, notification);

  _rehydrateNotifications = async () => {
    this._waitForInitializationFinish();
    const notifications = await Storage.getForCurrentUser(
      NOTIFICATIONS_STORAGE_KEY,
    );

    const notificationEntries = notifications
      ? notifications.map((notification: Notification): [
          string,
          Notification,
        ] => [notification.id, notification])
      : [];

    runInAction(() => {
      this._notificationsByID.merge((notificationEntries: any));
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

  _onRawNotification = (rawNotification: Object) => {
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
        KegStore.flushCache();
        nullthrows(this._navigation).navigate('tapDetails', {
          id: notification.tapId,
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
