import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';

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
import { Storage, StorageKeys } from 'utils/Storage';

import type { EntityID } from '@brewskey/js-api';
import type { NotificationPermissionsStatus } from 'expo-notifications';
import type { ReactNode } from 'react';

import type { Notification } from 'stores/NotificationTypes';

/** Mirrors expo-notifications README; permission base types omit `granted` in some TS setups. */
function isNotificationPermissionGranted(
  settings: NotificationPermissionsStatus,
): boolean {
  const grantedFlag = (settings as { granted?: boolean }).granted === true;
  const ios = settings.ios?.status;
  const iosAllowed =
    ios === Notifications.IosAuthorizationStatus.AUTHORIZED ||
    ios === Notifications.IosAuthorizationStatus.PROVISIONAL;
  return grantedFlag || iosAllowed;
}

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
  // Suppressed for now: Firebase/FCM is not yet configured on Android, so push
  // token registration always fails with a "Default FirebaseApp is not
  // initialized" error. Logging instead of alerting avoids interrupting the UI
  // every time the user opens the Notifications tab.
  // eslint-disable-next-line no-console -- intentional diagnostic logging
  console.warn('[push-notifications]', errorMessage);
}

type PushRegistrationMetadata = {
  installationId: string;
  deviceToken: string;
  platform: 'fcm' | 'ios';
  registeredAtISO: string;
};

type PendingPushUnregister = {
  installationId: string;
  queuedAtISO: string;
};

async function loadPushRegistrationMetadata(): Promise<PushRegistrationMetadata | null> {
  return Storage.getItem<PushRegistrationMetadata>(StorageKeys.PushRegistration);
}

async function savePushRegistrationMetadata(
  metadata: PushRegistrationMetadata,
): Promise<void> {
  await Storage.setItem(StorageKeys.PushRegistration, metadata);
}

async function clearPushRegistrationMetadata(): Promise<void> {
  await Storage.removeItem(StorageKeys.PushRegistration);
}

async function loadPendingPushUnregister(): Promise<PendingPushUnregister | null> {
  return Storage.getItem<PendingPushUnregister>(StorageKeys.PendingPushUnregister);
}

async function savePendingPushUnregister(installationId: string): Promise<void> {
  await Storage.setItem(StorageKeys.PendingPushUnregister, {
    installationId,
    queuedAtISO: new Date().toISOString(),
  });
}

async function clearPendingPushUnregister(): Promise<void> {
  await Storage.removeItem(StorageKeys.PendingPushUnregister);
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

  const existing = await Notifications.getPermissionsAsync();
  let permitted = isNotificationPermissionGranted(existing);
  if (!permitted) {
    const requested = await Notifications.requestPermissionsAsync();
    permitted = isNotificationPermissionGranted(requested);
  }
  if (!permitted) {
    handleRegistrationError(
      'Permission not granted to get push token for push notification!',
    );
    return undefined;
  }

  try {
    const nativeToken = await Notifications.getDevicePushTokenAsync();
    if (!nativeToken?.data) {
      handleRegistrationError('Native push token was empty');
      return undefined;
    }
    return String(nativeToken.data);
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

async function unregisterTokenWithBackend(
  installationId: string,
  accessToken: string | null,
): Promise<void> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  const response = await fetch(
    `${BASE_PUSH_URL}/${encodeURIComponent(installationId)}`,
    {
      headers,
      method: 'DELETE',
    },
  );
  if (!response.ok) {
    throw new Error(`Push unregister failed: ${response.status}`);
  }
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
  const previousAccessTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!authResponse?.accessToken || isWeb) {
      return undefined;
    }

    let tokenSub: Notifications.EventSubscription | undefined;
    const persistNotification = async (
      expoNotification: Notifications.Notification,
      options: { isRead: boolean; shouldNavigate: boolean },
    ): Promise<Notification> => {
      const notification = normalizeNotificationFromExpo(expoNotification, {
        isRead: options.isRead,
      });
      await addRef.current(notification);
      if (options.isRead) {
        await setReadRef.current(notification.id);
      }
      if (options.shouldNavigate) {
        handleNotificationPress(notification, userIdStr, router);
      }
      return notification;
    };

    const receivedSub = Notifications.addNotificationReceivedListener((n) => {
      persistNotification(n, { isRead: false, shouldNavigate: false }).then(
        (notification) => {
          Vibration.vibrate(500);
          showNotificationInSnackBar(notification);
        },
      );
    });
    const responseSub = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        await persistNotification(response.notification, {
          isRead: true,
          shouldNavigate: true,
        });
      },
    );
    const appStateSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEY });
      }
    });

    Notifications.getLastNotificationResponseAsync().then(async (last) => {
      if (!last?.notification) {
        return;
      }
      await persistNotification(last.notification, {
        isRead: true,
        shouldNavigate: true,
      });
      await Notifications.clearLastNotificationResponseAsync();
    });

    const processPendingUnregister = async () => {
      const pending = await loadPendingPushUnregister();
      if (!pending) {
        return;
      }
      try {
        await unregisterTokenWithBackend(
          pending.installationId,
          authResponse.accessToken,
        );
        await clearPendingPushUnregister();
      } catch {
        // Keep pending for next retry.
      }
    };

    const runRegistration = async () => {
      await processPendingUnregister();
      const token = await registerForPushNotificationsAsync();
      if (!token) {
        return;
      }

      const removeTapIDs = Array.isArray(disabledTaps) ? disabledTaps : [];
      const installationId = await getUniqueDeviceId();
      const platform = Platform.OS === 'android' ? 'fcm' : 'ios';
      try {
        await registerTokenWithBackend(
          authResponse.accessToken,
          token,
          removeTapIDs,
        );
        await savePushRegistrationMetadata({
          installationId,
          deviceToken: token,
          platform,
          registeredAtISO: new Date().toISOString(),
        });
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
          await savePushRegistrationMetadata({
            installationId,
            deviceToken: t,
            platform,
            registeredAtISO: new Date().toISOString(),
          });
        } catch {
          /* non-fatal */
        }
      });
    };

    runRegistrationRef.current = runRegistration;

    return () => {
      void tokenSub?.remove();
      void receivedSub?.remove();
      void responseSub?.remove();
      void appStateSub.remove();
    };
  }, [authResponse?.accessToken, userIdStr, disabledTaps, router]);

  useEffect(() => {
    if (isWeb) {
      previousAccessTokenRef.current = authResponse?.accessToken ?? null;
      return;
    }

    const previousAccessToken = previousAccessTokenRef.current;
    const currentAccessToken = authResponse?.accessToken ?? null;
    previousAccessTokenRef.current = currentAccessToken;
    if (!previousAccessToken || currentAccessToken) {
      return;
    }

    const cleanupPushOnLogout = async () => {
      try {
        const metadata = await loadPushRegistrationMetadata();
        const installationId =
          metadata?.installationId ?? (await getUniqueDeviceId());
        await unregisterTokenWithBackend(installationId, null);
        await clearPendingPushUnregister();
      } catch {
        const metadata = await loadPushRegistrationMetadata();
        if (metadata?.installationId) {
          await savePendingPushUnregister(metadata.installationId);
        }
      } finally {
        await clearPushRegistrationMetadata();
      }
    };

    void cleanupPushOnLogout();
  }, [authResponse?.accessToken]);

  const requestPermissionAndRegister = useCallback(async () => {
    await runRegistrationRef.current();
  }, []);

  useEffect(() => {
    if (isWeb) {
      return;
    }
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
        ? (window as Window & {
            __PLAYWRIGHT_TEST__?: boolean;
            __PLAYWRIGHT_SIMULATE_NOTIFICATION_RESPONSE__?: (
              payload: Record<string, unknown>,
            ) => Promise<void>;
          })
        : null;
    if (!win?.__PLAYWRIGHT_TEST__) {
      return undefined;
    }
    const simulate = async (payload: Record<string, unknown>) => {
      const notification = normalizeNotificationFromPayload(payload, {
        isRead: false,
      });
      await addRef.current(notification);
      showNotificationInSnackBar(notification);
    };
    const simulateResponse = async (payload: Record<string, unknown>) => {
      const notification = normalizeNotificationFromPayload(payload, {
        isRead: true,
      });
      await addRef.current(notification);
      await setReadRef.current(notification.id);
      handleNotificationPress(notification, userIdStr, router);
    };
    (
      win as Window & { __PLAYWRIGHT_SIMULATE_NOTIFICATION__?: typeof simulate }
    ).__PLAYWRIGHT_SIMULATE_NOTIFICATION__ = simulate;
    win.__PLAYWRIGHT_SIMULATE_NOTIFICATION_RESPONSE__ = simulateResponse;
    return () => {
      void delete (
        win as Window & { __PLAYWRIGHT_SIMULATE_NOTIFICATION__?: unknown }
      ).__PLAYWRIGHT_SIMULATE_NOTIFICATION__;
      void delete win.__PLAYWRIGHT_SIMULATE_NOTIFICATION_RESPONSE__;
    };
  }, [router, userIdStr]);

  return { requestPermissionAndRegister };
}
