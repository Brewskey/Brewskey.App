import type { AchievementType, EntityID } from '@brewskey/js-api';

import { Platform, Vibration } from 'react-native';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import Storage from '../utils/Storage';
import CONFIG from '../config';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getUniqueDeviceId } from '../utils/getUniqueDeviceId';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { queryClient } from '../../App';
import SnackBarStore from '../hooks/context/SnackBarContext';
import { KegQueryKeys } from '../hooks/queries/KegQueries';
import { FriendKeys } from '../hooks/queries/FriendQueries';
import { AchievementQueryKeys } from '../hooks/queries/AchievementQueries';

const BASE_PUSH_URL = `${CONFIG.HOST}/api/v2/push`;

const NOTIFICATIONS_STORAGE_KEY = 'notifications';
const DISABLED_NOTIFICATIONS_TAPS_STORAGE_KEY = 'notifications/disabledTaps';

export type BaseNotificationProps = {
  body: string;
  date: Date;
  id: string;
  isRead: boolean;
  title: string;
};

export type LowKegLevelNotification = BaseNotificationProps & {
  beverageId: EntityID;
  beverageName: string;
  kegId: EntityID;
  tapId: EntityID;
  type: 'lowKegLevel';
};

export type NewAchievementNotification = BaseNotificationProps & {
  achievementType: AchievementType;
  type: 'newAchievement';
};

export type NewFriendRequestNotification = BaseNotificationProps & {
  friendId: EntityID;
  friendUserName: string;
  type: 'newFriendRequest';
};

export type TextNotification = BaseNotificationProps & {
  type: 'text';
};

export type Notification =
  | LowKegLevelNotification
  | NewAchievementNotification
  | NewFriendRequestNotification
  | TextNotification;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError(
        'Permission not granted to get push token for push notification!',
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
      return;
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

const useNotifications = () => {
  const [_expoPushToken, setExpoPushToken] = useState('');
  const [_notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
  const responseListener = useRef<Notifications.Subscription | undefined>(undefined);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ''))
      .catch((error) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((newNotification) => {
        setNotification(newNotification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }

      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);
};

const useOnPressNotification = (): ((arg1: Notification) => void) => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useUserID } = require('./AuthStore');
  const userId = useUserID();
  return useCallback((notification: Notification): void => {
    switch (notification.type) {
      case 'lowKegLevel': {
        const { tapId, kegId } = notification;
        queryClient.invalidateQueries({ queryKey: [KegQueryKeys.KeyById, kegId] });
        navigation.navigate('LoggedInStack', {
          screen: 'home',
          params: {
            screen: 'tapDetails',
            params: {
              tapId,
            },
          },
        });
        break;
      }
      case 'newAchievement': {
        if (userId) {
          queryClient.invalidateQueries({
            queryKey: [AchievementQueryKeys.CountsByUserId, userId],
          });
        }
        navigation.navigate('LoggedInStack', {
          screen: 'stats',
          params: {
            initialPopUpAchievementType: notification.achievementType,
          },
        });
        break;
      }
      case 'newFriendRequest': {
        queryClient.invalidateQueries({ queryKey: [FriendKeys.GetMany] });
        queryClient.invalidateQueries({ queryKey: [FriendKeys.GetSingle] });
        // NavigationService.navigate('myFriendsRequest');
        break;
      }
      default: {
        break;
      }
    }
  }, [userId, navigation]);
};

class NotificationsStore {
  _isReady: boolean = false;

  _notificationsByID: Map<string, Notification> = new Map();

  _deviceToken!: string;

  // its Map but used as Set since mobx doesn't support Set;

  _notificationsDisabledByTapID: Map<EntityID, boolean> = new Map();

  // constructor() {
  //   AppState.addEventListener('change', (nextAppState) => {
  //     if (nextAppState === 'active') {
  //       PushNotification.cancelAllLocalNotifications();
  //     }
  //     this._rehydrateState();
  //   });

  //   reaction(
  //     () => this._disabledTapIDs,
  //     (disabledTapIDs: Array<EntityID>) => {
  //       if (!this._isReady) {
  //         return;
  //       }
  //       this._registerToken();
  //       Storage.setForCurrentUser(
  //         DISABLED_NOTIFICATIONS_TAPS_STORAGE_KEY,
  //         disabledTapIDs,
  //       );
  //     },
  //     {
  //       compareStructural: true,
  //     } as any,
  //   );

  //   reaction(
  //     () => this.notifications,
  //     (notifications: Array<Notification>) => {
  //       if (!this._isReady) {
  //         return;
  //       }
  //       Storage.setForCurrentUser(NOTIFICATIONS_STORAGE_KEY, notifications);
  //     },
  //     {
  //       compareStructural: true,
  //     } as any,
  //   );

  //   reaction(
  //     () => AuthStore.isAuthorized,
  //     async (isAuthorized: boolean) => {
  //       if (!isAuthorized) {
  //         // calls only on logout
  //         this._unregisterToken();
  //         this.setIsReady(false);
  //         this._cleanState();
  //       } else {
  //         // calls on login and on every app start
  //         PushNotification.configure({
  //           onNotification: this._onRawNotification,
  //           onRegister: (result) => {
  //             this._deviceToken = result.token;
  //             this._registerToken();
  //           },
  //           requestPermissions: true,
  //           senderID: '394986866677',
  //         });

  //         await this._rehydrateState();
  //         this.setIsReady(true);
  //       }
  //       // casting because Mobx reaction type expect returns undefined, not Promise
  //     },
  //   );

  //   // calls only login
  //   // spy(event => {
  //   //   if (event.type === 'action' && event.name === 'loginSuccess') {
  //   //     this._registerToken();
  //   //   }
  //   // });
  // }

  get notifications(): Notification[] {
    return Array.from(this._notificationsByID.values()).sort(
      (a: Notification, b: Notification): number =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }

  get unreadCount(): number {
    return Array.from(this._notificationsByID.values()).filter(
      ({ isRead }: Notification) => !isRead,
    ).length;
  }

  get hasUnread(): boolean {
    return this.unreadCount > 0;
  }

  get _disabledTapIDs(): EntityID[] {
    return Array.from(this._notificationsDisabledByTapID.keys());
  }

  onNotificationPress: (arg1: Notification, userId?: string | null) => Promise<void> = async (
    notification: Notification,
    userId?: string | null,
  ): Promise<void> => {
    this._handleNotificationPressByType(notification, userId ?? null);
  };

  getIsNotificationsEnabledForTap: (arg1: EntityID) => boolean = (
    tapID: EntityID,
  ): boolean => !this._notificationsDisabledByTapID.has(tapID);

  toggleNotificationsForTap: (arg1: EntityID) => void = (
    tapID: EntityID,
  ): void => {
    if (this._notificationsDisabledByTapID.has(tapID)) {
      this._notificationsDisabledByTapID.delete(tapID);
    } else {
      this._notificationsDisabledByTapID.set(tapID, true);
    }
  };

  setIsReady: (arg1: boolean) => void = (isReady: boolean): void => {
    this._isReady = isReady;
  };

  deleteAllNotifications: () => void = (): void =>
    this._notificationsByID.clear();

  deleteByID: (arg1: string) => void = (id: string): void => {
    this._notificationsByID.delete(id);
  };

  setRead: (arg1: string) => void = (notificationID: string): void => {
    const notification = this._notificationsByID.get(notificationID);
    if (!notification) {
      return;
    }

    this._notificationsByID.set(notificationID, {
      ...notification,
      isRead: true,
    });
  };

  _addNotification: (arg1: Notification) => void = (
    notification: Notification,
  ): void => {
    if (notification.type === 'newFriendRequest') {
      queryClient.invalidateQueries({ queryKey: [FriendKeys.GetMany] });
      queryClient.invalidateQueries({ queryKey: [FriendKeys.GetSingle] });
    }
    this._notificationsByID.set(notification.id, notification);
  };

  _cleanState: () => void = (): void => {
    this._notificationsByID.clear();
    this._notificationsDisabledByTapID.clear();
  };

  _rehydrateState: () => Promise<void> = async (): Promise<void> => {
    const notifications =
      (await Storage.getForCurrentUser<Notification[]>(
        NOTIFICATIONS_STORAGE_KEY,
      )) || [];

    // if (Platform.OS === 'ios') {
    //   const newNotifications = await new Promise((resolve) =>
    //     PushNotificationIOS.getDeliveredNotifications(resolve),
    //   );
    //   PushNotificationIOS.removeDeliveredNotifications(
    //     newNotifications.map((item) => item.identifier),
    //   );

    //   notifications.push(
    //     ...newNotifications.map((item) => ({
    //       ...item.userInfo,
    //       ...item.userInfo.aps.alert,
    //     })),
    //   );
    // }

    const notificationEntries = notifications
      ? notifications.map(
          (notification: Notification): [string, Notification] => [
            notification.id,
            notification,
          ],
        )
      : [];

    const disabledTapIDs = await Storage.getForCurrentUser<EntityID[]>(
      DISABLED_NOTIFICATIONS_TAPS_STORAGE_KEY,
    );

    const disabledTapsIDsEntries = disabledTapIDs
      ? disabledTapIDs.map((tapID: EntityID): [EntityID, true] => [tapID, true])
      : [];

    // runInAction(() => {
    //   this._notificationsDisabledByTapID.merge(disabledTapsIDsEntries as any);
    //   this._notificationsByID.merge(notificationEntries as any);
    // });

    // if (notifications.some((item) => item.type === 'newFriendRequest')) {
    //   runInAction(() => {
    //     FriendStore.flushCache();
    //   });
    // }
  };

  _registerToken: (accessToken: string | null) => Promise<void> = async (accessToken: string | null): Promise<void> => {
    const deviceUniqueID = await getUniqueDeviceId();

    const body = JSON.stringify({
      deviceToken: this._deviceToken,
      installationId: deviceUniqueID,
      platform: Platform.OS === 'android' ? 'fcm' : 'ios',
      removeTapIDs: this._disabledTapIDs,
    });

     
    await fetch(`${BASE_PUSH_URL}/`, {
      body,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken || ''}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
  };

  _unregisterToken = async (): Promise<void> => {
    await fetch(`${BASE_PUSH_URL}/${await getUniqueDeviceId()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });
  };

  _onRawNotification = (rawNotification: {
    custom_notification?: string;
    data?: Record<string, unknown>;
    alert?: string | Record<string, unknown>;
    finish(data: Record<string, unknown>): void;
  }): void => {
    // ignore empty callbackNotification call when open the app
    // from main icon when the app is in background currently

    console.log(rawNotification);

    let parsedNotification = null;
    if (Platform.OS === 'android') {
      parsedNotification = rawNotification.custom_notification
        ? JSON.parse(rawNotification.custom_notification)
        : rawNotification.data;
    } else {
      if (
        typeof rawNotification.alert === 'string' ||
        (rawNotification.alert != null &&
          rawNotification.alert instanceof String)
      ) {
        rawNotification.alert = {
          date: new Date(),
          id: Date.now(),
          title: rawNotification.alert,
          type: 'text',
        };
      }

      parsedNotification = {
        ...rawNotification.data,
        ...rawNotification.alert,
      };
      // rawNotification.finish(PushNotificationIOS.FetchResult.NoData);
    }

    const existingNotification = this._notificationsByID.get(
      parsedNotification.id,
    );

    const openedFromTray = !!parsedNotification.userInteraction;

    const notification = {
      ...parsedNotification,
      date: existingNotification ? existingNotification.date : new Date(),
      isRead: openedFromTray,
    } as const;
    this._addNotification(notification);

    if (openedFromTray) {
      this.onNotificationPress(notification);
    } else {
      Vibration.vibrate(500);
      SnackBarStore.showMessage({
        duration: 3000,
        content: notification,
        position: 'top',
      });
    }
  };

  _handleNotificationPressByType: (arg1: Notification, userId: string | null) => void = (
    notification: Notification,
    userId: string | null,
  ): void => {
    switch (notification.type) {
      case 'lowKegLevel': {
        const { kegId, tapId } = notification;
        queryClient.invalidateQueries({ queryKey: [KegQueryKeys.KeyById, kegId] });
        // NavigationService.navigate('tapDetails', {
        //   backToRouteName: 'notifications',
        //   id: tapId,
        // });
        break;
      }
      case 'newAchievement': {
        if (userId) {
          queryClient.invalidateQueries({
            queryKey: [AchievementQueryKeys.CountsByUserId, userId],
          });
        }
        // NavigationService.navigate('stats', {
        //   initialPopUpAchievementType: notification.achievementType,
        // });
        break;
      }
      case 'newFriendRequest': {
        queryClient.invalidateQueries({ queryKey: [FriendKeys.GetMany] });
        queryClient.invalidateQueries({ queryKey: [FriendKeys.GetSingle] });
        // NavigationService.navigate('myFriendsRequest');
        break;
      }
      default: {
        break;
      }
    }
  };
}

const notificationsStore = new NotificationsStore();

// Hook wrapper for React components to use onNotificationPress with userId
export const useNotificationPress = () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useUserID } = require('./AuthStore');
  const userId = useUserID();
  
  return useCallback((notification: Notification): Promise<void> => {
    return notificationsStore.onNotificationPress(notification, userId);
  }, [userId]);
};

export default notificationsStore;
