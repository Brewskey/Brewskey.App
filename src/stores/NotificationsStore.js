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
const DISABLED_NOTIFICATIONS_TAPS_STORAGE_KEY = 'notifications/disabledTaps';

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
  kegId: EntityID,
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
  @observable _isReady: boolean = false;
  @observable _navigation: ?Navigation = null;
  @observable
  _notificationsByID: ObservableMap<string, Notification> = new Map();

  // its Map but used as Set since mobx doesn't support Set;
  @observable
  _notificationsDisabledByTapID: ObservableMap<EntityID, boolean> = new Map();

  constructor() {
    AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        FCM.removeAllDeliveredNotifications();
      }
    });
    FCM.on(FCMEvent.Notification, this._onRawNotification);

    reaction(
      () => this._disabledTapIDs,
      (disabledTapIDs: Array<EntityID>) => {
        if (!this._isReady) {
          return;
        }
        this._registerToken();
        Storage.setForCurrentUser(
          DISABLED_NOTIFICATIONS_TAPS_STORAGE_KEY,
          disabledTapIDs,
        );
      },
      ({
        compareStructural: true,
      }: any),
    );

    reaction(
      () => this.notifications,
      (notifications: Array<Notification>) => {
        if (!this._isReady) {
          return;
        }
        Storage.setForCurrentUser(NOTIFICATIONS_STORAGE_KEY, notifications);
      },
      ({
        compareStructural: true,
      }: any),
    );

    reaction(
      () => AuthStore.isAuthorized,
      async (isAuthorized: boolean) => {
        if (!isAuthorized) {
          // calls only on logout
          this._unregisterToken();
          this.setIsReady(false);
          this._cleanState();
        } else {
          // calls on login and on every app start
          await this._rehydrateState();
          this.setIsReady(true);
        }
      },
    );
  }

  @computed
  get notifications(): Array<Notification> {
    return Array.from(this._notificationsByID.toJS().values()).sort(
      (a: Notification, b: Notification): number =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  @computed
  get unreadCount(): number {
    return Array.from(this._notificationsByID.toJS().values()).filter(
      ({ isRead }: Notification) => !isRead,
    ).length;
  }

  @computed
  get hasUnread(): boolean {
    return this.unreadCount > 0;
  }

  @computed
  get _disabledTapIDs(): Array<EntityID> {
    return Array.from(this._notificationsDisabledByTapID.toJS().keys());
  }

  handleInitialNotification = async () => {
    await when(() => this._isReady);
    const initialNotification = await FCM.getInitialNotification();
    initialNotification && this._onRawNotification(initialNotification);
  };

  onNotificationPress = async (notification: Notification): Promise<void> => {
    await when(() => this._isReady);
    this._handleNotificationPressByType(notification);
  };

  getIsNotificationsEnabledForTap = (tapID: EntityID) =>
    !this._notificationsDisabledByTapID.has(tapID);

  @action
  toggleNotificationsForTap = (tapID: EntityID) => {
    this._notificationsDisabledByTapID.has(tapID)
      ? this._notificationsDisabledByTapID.delete(tapID)
      : this._notificationsDisabledByTapID.set(tapID, true);
  };

  @action
  setIsReady = (isReady: boolean) => {
    this._isReady = isReady;
  };

  @action
  setNavigation = (navigation: Navigation) => {
    this._navigation = navigation;
  };

  @action deleteAllNotifications = () => this._notificationsByID.clear();

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

  onLogin = () => {
    // find a way if its possible avoid this public method and make reaction
    // which is triggered only on login(not on login and app start).
    this._registerToken();
  };

  @action
  _addNotification = (notification: Notification): void =>
    this._notificationsByID.set(notification.id, notification);

  @action
  _cleanState = () => {
    this._notificationsByID.clear();
    this._notificationsDisabledByTapID.clear();
  };

  _rehydrateState = async () => {
    const notifications = await Storage.getForCurrentUser(
      NOTIFICATIONS_STORAGE_KEY,
    );

    const notificationEntries = notifications
      ? notifications.map((notification: Notification): [
          string,
          Notification,
        ] => [notification.id, notification])
      : [];

    const disabledTapIDs = await Storage.getForCurrentUser(
      DISABLED_NOTIFICATIONS_TAPS_STORAGE_KEY,
    );

    const disabledTapsIDsEntries = disabledTapIDs
      ? disabledTapIDs.map((tapID: EntityID): [EntityID, true] => [tapID, true])
      : [];

    runInAction(() => {
      this._notificationsDisabledByTapID.merge((disabledTapsIDsEntries: any));
      this._notificationsByID.merge((notificationEntries: any));
    });
  };

  _registerToken = async () => {
    const fcmToken = await FCM.getFCMToken();
    const deviceUniqueID = DeviceInfo.getUniqueID();

    // eslint-disable-next-line
    await fetch(`${BASE_PUSH_URL}/`, {
      body: JSON.stringify({
        deviceToken: fcmToken,
        installationId: deviceUniqueID,
        platform: 'fcm',
        removeTapIDs: this._disabledTapIDs,
      }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${AuthStore.token || ''}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
  };

  _unregisterToken = () =>
    // eslint-disable-next-line
    fetch(`${BASE_PUSH_URL}/${DeviceInfo.getUniqueID()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
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
        const { kegId, tapId } = notification;
        KegStore.flushCacheForEntity(kegId);
        nullthrows(this._navigation).navigate('tapDetails', {
          id: tapId,
        });
        break;
      }
      case 'newAchievement': {
        AchievementStore.flushCustomCache();
        nullthrows(this._navigation).navigate('stats', {
          initialPopUpAchievementType: notification.achievementType,
        });
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
