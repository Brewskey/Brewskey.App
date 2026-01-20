import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
  static _getUserID: () => Promise<string> = async () => '';

  static setGetUserID = (getUserID: () => Promise<string>) => {
    this._getUserID = getUserID;
  };

  // Basic storage methods (use SecureStore on native, AsyncStorage on web)
  static async setItem<TResult>(key: string, value: TResult): Promise<void> {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } else {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
    }
  }

  static async getItem<TResult>(key: string): Promise<TResult | null> {
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

  static async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      return AsyncStorage.removeItem(key);
    } else {
      return SecureStore.deleteItemAsync(key);
    }
  }

  // Legacy methods for backward compatibility (always use AsyncStorage)
  static set = <TValue>(key: string, value: TValue): Promise<void> =>
    AsyncStorage.setItem(key, JSON.stringify(value));

  static get = async <TValue>(key: string): Promise<TValue | null> => {
    const stringValue = await AsyncStorage.getItem(key);
    return stringValue ? JSON.parse(stringValue) : null;
  };

  static remove = AsyncStorage.removeItem;

  // User-scoped storage methods
  static setForCurrentUser = async <TValue>(
    key: string,
    value: TValue,
  ): Promise<void> => {
    const keyForCurrentUser = await Storage._getKeyForCurrentUser(key);
    await Storage.set(keyForCurrentUser, value);
  };

  static getForCurrentUser = async <TResult>(key: string): Promise<TResult | null> => {
    const keyForCurrentUser = await Storage._getKeyForCurrentUser(key);
    return Storage.get<TResult>(keyForCurrentUser);
  };

  static removeForCurrentUser = async (key: string): Promise<void> => {
    const keyForCurrentUser = await Storage._getKeyForCurrentUser(key);
    return Storage.remove(keyForCurrentUser);
  };

  static _getKeyForCurrentUser = async (key: string): Promise<string> => {
    const userID = await Storage._getUserID();
    return `${userID}/${key}`;
  };
}

// Expose Storage on window object for web/e2e environments
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  (window as any).Storage = Storage;
}

export default Storage;
