import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';

import Constants from 'expo-constants';
import { isDevice } from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { AppState, Platform, Vibration } from 'react-native';

import { CONFIG } from 'config';
import { useAuthSession } from 'hooks/context/AuthContext';
import { SnackBarStore } from 'hooks/context/SnackBarContext';
import { AchievementQueryKeys } from 'hooks/queries/AchievementQueries';
import { FriendKeys } from 'hooks/queries/FriendQueries';
import { KegQueryKeys } from 'hooks/queries/KegQueries';
import {
  loadDisabledTapsFromStorage,
  normalizeNotificationFromExpo,
  normalizeNotificationFromPayload,
  NOTIFICATION_QUERY_KEY,
  useAddNotification,
  useNotificationsDisabledTaps,
  useNotificationsList,
  useSetNotificationRead,
} from 'hooks/queries/NotificationQueries';
import { getStringFromEntityID } from 'utils/getStringFromEntityID';
import { getUniqueDeviceId } from 'utils/getUniqueDeviceId';
import { queryClient } from 'utils/queryClient';

import type { EntityID } from '@brewskey/js-api';
import type { ReactNode } from 'react';

import type { Notification } from 'stores/NotificationTypes';

const BASE_PUSH_URL = `${CONFIG.HOST}/api/v2/push`;
const isWeb = Platform.OS === 'web';

if (!isWeb) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

function showNotificationInSnackBar(notification: Notification): void {
  SnackBarStore.showMessage({
    duration: 3000,
    content: notification,
    position: 'top',
  });
}

function handleRegistrationError(errorMessage: string): void {
  if (typeof alert !== 'undefined') {
    alert(errorMessage);
  }
}

async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!isDevice) {
    handleRegistrationError('Must use physical device for push notifications');
    return undefined;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    handleRegistrationError(
      'Permission not granted to get push token for push notification!',
    );
    return undefined;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) {
    handleRegistrationError('Project ID not found');
    return undefined;
  }

  try {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
      .data;
    return token;
  } catch (e: unknown) {
    handleRegistrationError(String(e));
    return undefined;
  }
}

async function registerTokenWithBackend(
  accessToken: string | null,
  deviceToken: string,
  removeTapIDs: EntityID[],
): Promise<void> {
  const installationId = await getUniqueDeviceId();
  const body = JSON.stringify({
    deviceToken,
    installationId,
    platform: Platform.OS === 'android' ? 'fcm' : 'ios',
    removeTapIDs: removeTapIDs.map((id) => getStringFromEntityID(id)),
  });
  await fetch(`${BASE_PUSH_URL}/`, {
    body,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
}

function handleNotificationPress(
  notification: Notification,
  userId: string | null,
  router: ReturnType<typeof useRouter>,
): void {
  switch (notification.type) {
    case 'lowKegLevel': {
      const { tapId, kegId } = notification;
      queryClient.invalidateQueries({
        queryKey: [KegQueryKeys.KeyById, getStringFromEntityID(kegId)],
      });
      router.navigate({
        pathname: '/taps/[tapId]/on_tap',
        params: { tapId: getStringFromEntityID(tapId) },
      });
      break;
    }
    case 'newAchievement': {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: [
            AchievementQueryKeys.CountsByUserId,
            getStringFromEntityID(userId),
          ],
        });
      }
      router.navigate({
        pathname: '/',
        params: {
          initialPopUpAchievementType: notification.achievementType,
        },
      });
      break;
    }
    case 'newFriendRequest': {
      queryClient.invalidateQueries({ queryKey: [FriendKeys.GetMany] });
      queryClient.invalidateQueries({ queryKey: [FriendKeys.GetSingle] });
      router.navigate({
        pathname: '/my-friends/myFriendsRequest',
        params: {},
      });
      break;
    }
    default:
      break;
  }
}

/**
 * Returns a callback to handle notification press (navigate by type, invalidate queries).
 * Use in NotificationsList and SnackBar.
 */
export function useNotificationPress(): (notification: Notification) => void {
  const router = useRouter();
  const { data: authResponse } = useAuthSession();
  const userIdStr =
    authResponse?.id != null ? getStringFromEntityID(authResponse.id) : null;
  return useCallback(
    (notification: Notification) => {
      handleNotificationPress(notification, userIdStr, router);
    },
    [userIdStr, router],
  );
}

export type RequestNotificationPermissionAndRegister = () => Promise<void>;

const NotificationRegistrationContext =
  createContext<RequestNotificationPermissionAndRegister | null>(null);

export function useRequestNotificationPermission(): RequestNotificationPermissionAndRegister | null {
  return useContext(NotificationRegistrationContext);
}

export const NotificationRegistrationProvider = ({
  requestPermissionAndRegister,
  children,
}: {
  requestPermissionAndRegister: RequestNotificationPermissionAndRegister;
  children: ReactNode;
}): ReactNode =>
  createElement(
    NotificationRegistrationContext.Provider,
    { value: requestPermissionAndRegister },
    children,
  );

/**
 * Sets up notification listeners (received + response), last-notification-response,
 * and AppState refetch. Does NOT request permission on mount; use the returned
 * requestPermissionAndRegister (e.g. when user visits the notifications tab).
 */
export function useNotificationHandlers(): {
  requestPermissionAndRegister: RequestNotificationPermissionAndRegister;
} {
  const { data: authResponse } = useAuthSession();
  const router = useRouter();
  const addNotification = useAddNotification();
  const setRead = useSetNotificationRead();
  const { data: disabledTaps } = useNotificationsDisabledTaps();
  const { data: notificationsList } = useNotificationsList();

  const addRef = useRef(addNotification.mutateAsync);
  const setReadRef = useRef(setRead.mutateAsync);
  addRef.current = addNotification.mutateAsync;
  setReadRef.current = setRead.mutateAsync;

  const userIdStr =
    authResponse?.id != null ? getStringFromEntityID(authResponse.id) : null;

  const runRegistrationRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    if (!authResponse?.accessToken || isWeb) return;

    let tokenSub: Notifications.EventSubscription | undefined;
    const receivedSub = Notifications.addNotificationReceivedListener((n) => {
      const notification = normalizeNotificationFromExpo(n, {
        isRead: false,
      });
      addRef.current(notification).then(() => {
        Vibration.vibrate(500);
        showNotificationInSnackBar(notification);
      });
    });
    const responseSub = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const notification = normalizeNotificationFromExpo(
          response.notification,
          { isRead: true },
        );
        await addRef.current(notification);
        await setReadRef.current(notification.id);
        handleNotificationPress(notification, userIdStr, router);
      },
    );
    const appStateSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEY });
      }
    });

    Notifications.getLastNotificationResponseAsync().then(async (last) => {
      if (!last?.notification) return;
      const notification = normalizeNotificationFromExpo(last.notification, {
        isRead: true,
      });
      await addRef.current(notification);
      await setReadRef.current(notification.id);
      handleNotificationPress(notification, userIdStr, router);
      await Notifications.clearLastNotificationResponseAsync();
    });

    const runRegistration = async () => {
      const token = await registerForPushNotificationsAsync();
      if (!token) return;

      const removeTapIDs = Array.isArray(disabledTaps) ? disabledTaps : [];
      try {
        await registerTokenWithBackend(
          authResponse.accessToken,
          token,
          removeTapIDs,
        );
      } catch {
        /* non-fatal */
      }

      tokenSub = Notifications.addPushTokenListener(async (newToken) => {
        const t =
          typeof newToken === 'object' &&
          newToken !== null &&
          'data' in newToken
            ? String((newToken as { data: unknown }).data)
            : String(newToken);
        try {
          const removeTapIDs = Array.isArray(disabledTaps)
            ? disabledTaps
            : await loadDisabledTapsFromStorage();
          await registerTokenWithBackend(
            authResponse.accessToken,
            t,
            removeTapIDs,
          );
        } catch {
          /* non-fatal */
        }
      });
    };

    runRegistrationRef.current = runRegistration;

    return () => {
      tokenSub?.remove();
      receivedSub?.remove();
      responseSub?.remove();
      appStateSub.remove();
    };
  }, [authResponse?.accessToken, userIdStr, disabledTaps, router]);

  const requestPermissionAndRegister = useCallback(async () => {
    await runRegistrationRef.current();
  }, []);

  useEffect(() => {
    if (isWeb) return;
    const unread = Array.isArray(notificationsList)
      ? notificationsList.filter((n) => !n.isRead).length
      : 0;
    Notifications.setBadgeCountAsync(unread).catch(() => {
      // Ignore when unsupported
    });
  }, [notificationsList]);

  useEffect(() => {
    const win =
      typeof window !== 'undefined'
        ? (window as Window & { __PLAYWRIGHT_TEST__?: boolean })
        : null;
    if (!win?.__PLAYWRIGHT_TEST__) return;
    const simulate = async (payload: Record<string, unknown>) => {
      const notification = normalizeNotificationFromPayload(payload, {
        isRead: false,
      });
      await addRef.current(notification);
      showNotificationInSnackBar(notification);
    };
    (
      win as Window & { __PLAYWRIGHT_SIMULATE_NOTIFICATION__?: typeof simulate }
    ).__PLAYWRIGHT_SIMULATE_NOTIFICATION__ = simulate;
    return () => {
      delete (
        win as Window & { __PLAYWRIGHT_SIMULATE_NOTIFICATION__?: unknown }
      ).__PLAYWRIGHT_SIMULATE_NOTIFICATION__;
    };
  }, []);

  return { requestPermissionAndRegister };
}
