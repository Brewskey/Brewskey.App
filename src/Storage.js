// @flow

import AsyncStorage from '@react-native-community/async-storage';
import nullthrows from 'nullthrows';

class Storage {
  static _getUserID: () => Promise<string> = () => '';

  static setGetUserID = (getUserID: () => Promise<string>) => {
    this._getUserID = getUserID;
  };

  static set = (key: string, value: Object): Promise<void> =>
    AsyncStorage.setItem(key, JSON.stringify(value));

  static get = async (key: string): Promise<any> => {
    const stringValue = await AsyncStorage.getItem(key);
    return stringValue ? JSON.parse(stringValue) : null;
  };

  static remove = AsyncStorage.removeItem;

  static setForCurrentUser = async (key: string, value: any): Promise<void> => {
    const keyForCurrentUser = await Storage._getKeyForCurrentUser(key);
    await Storage.set(keyForCurrentUser, value);
  };

  static getForCurrentUser = async (key: string): Promise<any> => {
    const keyForCurrentUser = await Storage._getKeyForCurrentUser(key);
    return Storage.get(keyForCurrentUser);
  };

  static removeForCurrentUser = async (key: string): Promise<void> => {
    const keyForCurrentUser = await Storage._getKeyForCurrentUser(key);
    return Storage.remove(keyForCurrentUser);
  };

  static _getKeyForCurrentUser = async (key: string): Promise<string> => {
    const userID = await Storage._getUserID();
    return `${userID}/${key}`;
  };

  static _getUserID = async (): Promise<string> => {
    return await Storage._getUserID();
  };
}

export default Storage;
