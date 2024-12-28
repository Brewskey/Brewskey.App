import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
  static _getUserID: () => Promise<string> = async () => '';

  static setGetUserID = (getUserID: () => Promise<string>) => {
    this._getUserID = getUserID;
  };

  static set = <TValue>(key: string, value: TValue): Promise<void> =>
    AsyncStorage.setItem(key, JSON.stringify(value));

  static get = async <TValue>(key: string): Promise<TValue> => {
    const stringValue = await AsyncStorage.getItem(key);
    return stringValue ? JSON.parse(stringValue) : null;
  };

  static remove = AsyncStorage.removeItem;

  static setForCurrentUser = async <TValue>(
    key: string,
    value: TValue,
  ): Promise<void> => {
    const keyForCurrentUser = await Storage._getKeyForCurrentUser(key);
    await Storage.set(keyForCurrentUser, value);
  };

  static getForCurrentUser = async <TResult>(key: string): Promise<TResult> => {
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
}

export default Storage;
