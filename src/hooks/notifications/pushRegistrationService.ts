import { isDevice } from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { CONFIG } from 'config';
import { getStringFromEntityID } from 'utils/getStringFromEntityID';
import { getUniqueDeviceId } from 'utils/getUniqueDeviceId';
import { Storage, StorageKeys } from 'utils/Storage';

import type { EntityID } from '@brewskey/js-api';
import type { NotificationPermissionsStatus } from 'expo-notifications';

const BASE_PUSH_URL = `${CONFIG.HOST}/api/v2/push`;

export interface PushRegistrationMetadata {
  installationId: string;
  deviceToken: string;
  platform: 'fcm' | 'ios';
  registeredAtISO: string;
}

interface PendingPushUnregister {
  installationId: string;
  queuedAtISO: string;
}

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

function handleRegistrationError(errorMessage: string): void {
  // eslint-disable-next-line no-console -- intentional diagnostic logging
  console.warn('[push-notifications]', errorMessage);
}

export async function loadPushRegistrationMetadata(): Promise<PushRegistrationMetadata | null> {
  return Storage.getItem<PushRegistrationMetadata>(
    StorageKeys.PushRegistration,
  );
}

export async function savePushRegistrationMetadata(
  metadata: PushRegistrationMetadata,
): Promise<void> {
  await Storage.setItem(StorageKeys.PushRegistration, metadata);
}

export async function clearPushRegistrationMetadata(): Promise<void> {
  await Storage.removeItem(StorageKeys.PushRegistration);
}

export async function loadPendingPushUnregister(): Promise<PendingPushUnregister | null> {
  return Storage.getItem<PendingPushUnregister>(
    StorageKeys.PendingPushUnregister,
  );
}

export async function savePendingPushUnregister(
  installationId: string,
): Promise<void> {
  await Storage.setItem(StorageKeys.PendingPushUnregister, {
    installationId,
    queuedAtISO: new Date().toISOString(),
  });
}

export async function clearPendingPushUnregister(): Promise<void> {
  await Storage.removeItem(StorageKeys.PendingPushUnregister);
}

export async function registerForPushNotificationsAsync(): Promise<
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

export async function registerTokenWithBackend(
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
  const response = await fetch(`${BASE_PUSH_URL}/`, {
    body,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken ?? ''}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
  if (!response.ok) {
    throw new Error(`Push register failed: ${response.status}`);
  }
}

export async function unregisterTokenWithBackend(
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
