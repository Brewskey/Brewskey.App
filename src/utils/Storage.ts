import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class Storage {
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
}
