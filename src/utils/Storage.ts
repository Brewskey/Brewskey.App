import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from '@brewskey/js-api';

export enum StorageKeys {
  SessionData = 'session_data',
  AppSettings = 'app_settings',
  Notifications = 'notifications',
  NotificationsDisabledTaps = 'notifications/disabledTaps',
}

type PerUserStorageKeys =  `${string}/${StorageKeys}`;

class Storage {
  // Basic storage methods (use SecureStore on native, AsyncStorage on web)
  static async setItem<TResult>(key: StorageKeys, value: TResult): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } else {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
    }
  }

  static async getItem<TResult>(key: StorageKeys): Promise<TResult | null> {
    let result: string | null = null;
    if (Platform.OS === 'web') {
      result = await AsyncStorage.getItem(key);
    } else {
      result = await SecureStore.getItemAsync(key);
    }

    if (result == null) {
      return null;
    }

    return JSON.parse(result) as TResult;
  }

  static async removeItem(key: StorageKeys): Promise<void> {
    if (Platform.OS === 'web') {
      return AsyncStorage.removeItem(key);
    } else {
      return SecureStore.deleteItemAsync(key);
    }
  }

  // Legacy methods for backward compatibility (always use AsyncStorage)
  static set = <TValue>(key: StorageKeys | PerUserStorageKeys, value: TValue): Promise<void> =>
    AsyncStorage.setItem(key, JSON.stringify(value));

  static get = async <TValue>(key: StorageKeys | PerUserStorageKeys): Promise<TValue | null> => {
    const stringValue = await AsyncStorage.getItem(key);
    return stringValue ? JSON.parse(stringValue) : null;
  };

  static remove = AsyncStorage.removeItem;

  // User-scoped storage methods
  static setForCurrentUser = async <TValue>(
    key: StorageKeys,
    value: TValue,
  ): Promise<void> => {
    const keyForCurrentUser = await Storage._getKeyForCurrentUser(key);
    await Storage.set(keyForCurrentUser, value);
  };

  static getForCurrentUser = async <TResult>(key: StorageKeys): Promise<TResult | null> => {
    const keyForCurrentUser = await Storage._getKeyForCurrentUser(key);
    return Storage.get<TResult>(keyForCurrentUser);
  };

  static removeForCurrentUser = async (key: StorageKeys): Promise<void> => {
    const keyForCurrentUser = await Storage._getKeyForCurrentUser(key);
    return Storage.remove(keyForCurrentUser);
  };

  static _getUserID = async (): Promise<string> => {
    const authResponse = await Storage.get(StorageKeys.SessionData) as AuthResponse | null;
    return authResponse?.id?.toString() || '';
  };

  static _getKeyForCurrentUser = async (key: StorageKeys): Promise<PerUserStorageKeys> => {
    const userID = await Storage._getUserID();
    return `${userID}/${key}`;
  };
}

// Expose Storage on window object for web/e2e environments
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  (window as any).Storage = Storage;
}

export default Storage;
