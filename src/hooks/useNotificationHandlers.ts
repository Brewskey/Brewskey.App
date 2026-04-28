import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';

import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { AppState, Platform } from 'react-native';

import { useAuthSession } from 'hooks/context/AuthContext';
import {
  onForegroundNotificationPersisted,
  persistExpoNotification,
} from 'hooks/notifications/notificationIngest';
import {
  clearPendingPushUnregister,
  clearPushRegistrationMetadata,
  loadPendingPushUnregister,
  loadPushRegistrationMetadata,
  registerForPushNotificationsAsync,
  registerTokenWithBackend,
  savePendingPushUnregister,
  savePushRegistrationMetadata,
  unregisterTokenWithBackend,
} from 'hooks/notifications/pushRegistrationService';
import { AchievementQueryKeys } from 'hooks/queries/AchievementQueries';
import { FriendKeys } from 'hooks/queries/FriendQueries';
import { KegQueryKeys } from 'hooks/queries/KegQueries';
import {
  loadDisabledTapsFromStorage,
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

import type { ReactNode } from 'react';

import type { Notification } from 'stores/NotificationTypes';

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

    const receivedSub = Notifications.addNotificationReceivedListener((n) => {
      persistExpoNotification(n, {
        isRead: false,
        shouldNavigate: false,
        addNotification: addRef.current,
        setNotificationRead: setReadRef.current,
        onNavigate: (notification) => {
          handleNotificationPress(notification, userIdStr, router);
        },
        onPersisted: onForegroundNotificationPersisted,
      });
    });
    const responseSub = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        await persistExpoNotification(response.notification, {
          isRead: true,
          shouldNavigate: true,
          addNotification: addRef.current,
          setNotificationRead: setReadRef.current,
          onNavigate: (notification) => {
            handleNotificationPress(notification, userIdStr, router);
          },
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
      await persistExpoNotification(last.notification, {
        isRead: true,
        shouldNavigate: true,
        addNotification: addRef.current,
        setNotificationRead: setReadRef.current,
        onNavigate: (notification) => {
          handleNotificationPress(notification, userIdStr, router);
        },
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
