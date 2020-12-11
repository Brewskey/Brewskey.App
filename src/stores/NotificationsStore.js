// @flow
/* eslint-disable react-native/split-platform-components */

import type { AchievementType, EntityID } from 'brewskey.js-api';
import type { ObservableMap } from 'mobx';
import type { Navigation } from '../types';

import {
  AppState,
  Platform,
  Vibration,
} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {
  action,
  computed,
  observable,
  reaction,
  runInAction,
  toJS,
  when,
} from 'mobx';
import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';
import AuthStore from './AuthStore';
import Storage from '../Storage';
import { AchievementStore, FriendStore, KegStore } from './DAOStores';
import CONFIG from '../config';
import NavigationService from '../NavigationService';
import SnackBarStore from './SnackBarStore';

const BASE_PUSH_URL = `${CONFIG.HOST}/api/v2/push`;

const NOTIFICATIONS_STORAGE_KEY = 'notifications';
const DISABLED_NOTIFICATIONS_TAPS_STORAGE_KEY = 'notifications/disabledTaps';

export type BaseNotificationProps = {|
  body: string,
  date: Date,
  id: string,
  isRead: string,
  title: string,
|};

export type LowKegLevelNotification = {|
  ...BaseNotificationProps,
  beverageId: EntityID,
  beverageName: string,
  kegId: EntityID,
  tapId: EntityID,
  type: 'lowKegLevel',
|};

export type NewAchievementNotification = {|
  ...BaseNotificationProps,
  achievementType: AchievementType,
  type: 'newAchievement',
|};

export type NewFriendRequestNotification = {|
  ...BaseNotificationProps,
  friendId: EntityID,
  friendUserName: string,
  type: 'newFriendRequest',
|};

export type TextNotification = {|
  ...BaseNotificationProps,
  type: 'text',
|};

export type Notification =
  | LowKegLevelNotification
  | NewAchievementNotification
  | NewFriendRequestNotification
  | TextNotification;

class NotificationsStore {
  @observable
  _isReady: boolean = false;
  @observable
  _navigation: ?Navigation = null;
  @observable
  _notificationsByID: ObservableMap<string, Notification> = observable.map();

  _deviceToken: string;

  // its Map but used as Set since mobx doesn't support Set;
  @observable
  _notificationsDisabledByTapID: ObservableMap<
    EntityID,
    boolean,
  > = observable.map();

  constructor() {
    AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        PushNotification.cancelAllLocalNotifications();
      }
      this._rehydrateState();
    });

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
          PushNotification.configure({
            onNotification: this._onRawNotification,
            onRegister: (result) => {
              this._deviceToken = result.token;
              this._registerToken();
            },
            requestPermissions: true,
            senderID: '394986866677',
          });

          await this._rehydrateState();
          this.setIsReady(true);
        }
        // casting because Mobx reaction type expect returns undefined, not Promise
      },
    );

    // calls only login
    // spy(event => {
    //   if (event.type === 'action' && event.name === 'loginSuccess') {
    //     this._registerToken();
    //   }
    // });
  }

  @computed
  get notifications(): Array<Notification> {
    return Array.from(this._notificationsByID.toJS().values()).sort(
      (a: Notification, b: Notification): number =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    ).map(item => toJS(item));
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

  onNotificationPress: (Notification) => Promise<void> = async (
    notification: Notification,
  ): Promise<void> => {
    await when(() => this._isReady);
    this._handleNotificationPressByType(notification);
  };

  getIsNotificationsEnabledForTap: (EntityID) => boolean = (
    tapID: EntityID,
  ): boolean => !this._notificationsDisabledByTapID.has(tapID);

  @action
  toggleNotificationsForTap: (EntityID) => void = (tapID: EntityID): void => {
    this._notificationsDisabledByTapID.has(tapID)
      ? this._notificationsDisabledByTapID.delete(tapID)
      : this._notificationsDisabledByTapID.set(tapID, true);
  };

  @action
  setIsReady: (boolean) => void = (isReady: boolean): void => {
    this._isReady = isReady;
  };

  @action
  setNavigation: (Navigation) => void = (navigation: Navigation): void => {
    this._navigation = navigation;
  };

  @action
  deleteAllNotifications: () => void = (): void =>
    this._notificationsByID.clear();

  @action
  deleteByID: (string) => void = (id: string): void =>
    this._notificationsByID.delete(id);

  @action
  setRead: (string) => void = (notificationID: string): void => {
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
  _addNotification: (Notification) => void = (
    notification: Notification,
  ): void => {
    if (notification.type === 'newFriendRequest') {
      FriendStore.flushCache();
    }
    this._notificationsByID.set(notification.id, notification);
  };

  @action
  _cleanState: () => void = (): void => {
    this._notificationsByID.clear();
    this._notificationsDisabledByTapID.clear();
  };

  _rehydrateState: () => Promise<void> = async (): Promise<void> => {
    const notifications =
      (await Storage.getForCurrentUser(NOTIFICATIONS_STORAGE_KEY)) || [];

    if (Platform.OS === 'ios') {
      const newNotifications = await new Promise((resolve) =>
        PushNotificationIOS.getDeliveredNotifications(resolve),
      );
      PushNotificationIOS.removeDeliveredNotifications(
        newNotifications.map((item) => item.identifier),
      );

      notifications.push(
        ...newNotifications.map((item) => ({
          ...item.userInfo,
          ...item.userInfo.aps.alert,
        })),
      );
    }

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

    if (notifications.some((item) => item.type === 'newFriendRequest')) {
      runInAction(() => {
        FriendStore.flushCache();
      });
    }
  };

  _registerToken: () => Promise<void> = async (): Promise<void> => {
    // wait for AuthStore.accessToken
    while (!AuthStore.accessToken) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    const deviceUniqueID = DeviceInfo.getUniqueId();

    const body = JSON.stringify({
      deviceToken: this._deviceToken,
      installationId: deviceUniqueID,
      platform: Platform.OS === 'android' ? 'fcm' : 'ios',
      removeTapIDs: this._disabledTapIDs,
    });

    // eslint-disable-next-line
    await fetch(`${BASE_PUSH_URL}/`, {
      body,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${AuthStore.accessToken || ''}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
  };

  _unregisterToken: () => void = (): void =>
    // eslint-disable-next-line
    fetch(`${BASE_PUSH_URL}/${DeviceInfo.getUniqueId()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });

  _onRawNotification = (rawNotification): void => {
    // ignore empty callbackNotification call when open the app
    // from main icon when the app is in background currently

    console.log(rawNotification);

    let parsedNotification = null;
    if (Platform.OS === 'android') {
      parsedNotification = rawNotification.custom_notification
        ? JSON.parse(rawNotification.custom_notification)
        : rawNotification.data;
    } else {
      if (typeof rawNotification.alert === 'string' || rawNotification.alert instanceof String) {
        rawNotification.alert = {
          date: new Date(),
          id: Date.now(),
          title: rawNotification.alert,
          type: 'text',
        }
      }

      parsedNotification = {
        ...rawNotification.data,
        ...rawNotification.alert,
      };
      rawNotification.finish(PushNotificationIOS.FetchResult.NoData);
    }

    const existingNotification = this._notificationsByID.get(
      parsedNotification.id,
    );

    const openedFromTray = !!parsedNotification.userInteraction;

    const notification = {
      ...parsedNotification,
      date: existingNotification ? existingNotification.date : new Date(),
      isRead: openedFromTray,
    };
    this._addNotification(notification);

    if (openedFromTray) {
      this.onNotificationPress(notification);
    } else {
      Vibration.vibrate(500);
      SnackBarStore.showMessage({
        duration: 3000,
        notification,
        position: 'top',
      });
    }
  };

  _handleNotificationPressByType: (Notification) => void = (
    notification: Notification,
  ): void => {
    switch (notification.type) {
      case 'lowKegLevel': {
        const { kegId, tapId } = notification;
        KegStore.flushCacheForEntity(kegId);
        NavigationService.navigate('tapDetails', {
          backToRouteName: 'notifications',
          id: tapId,
        });
        break;
      }
      case 'newAchievement': {
        AchievementStore.flushCustomCache();
        NavigationService.navigate('stats', {
          initialPopUpAchievementType: notification.achievementType,
        });
        break;
      }
      case 'newFriendRequest': {
        FriendStore.flushCache();
        NavigationService.navigate('myFriendsRequest');
        break;
      }
      default: {
        break;
      }
    }
  };
}

export default new NotificationsStore();
