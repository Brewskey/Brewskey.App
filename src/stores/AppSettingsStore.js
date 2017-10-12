// @flow

import type RootStore from './RootStore';

import { AsyncStorage } from 'react-native';
import { action, computed, observable, runInAction } from 'mobx';

const APP_SETTINGS_STORAGE_KEY = 'app_settings';

type AppSettings = {|
  manageTapsEnabled: boolean,
  multiAccountModeEnabled: boolean,
|};

// todo somehow save settings for particular user and restore them after relogin?
// or save user settings on the server?
class AppSettingsStore {
  _rootStore: RootStore;

  @observable
  _appSettings = {
    manageTapsEnabled: false,
    multiAccountModeEnabled: false,
  };

  constructor(rootStore: RootStore) {
    this._rootStore = rootStore;
  }

  @action
  initialize = async (): Promise<void> => {
    const appSettingsString = await AsyncStorage.getItem(
      APP_SETTINGS_STORAGE_KEY,
    );
    const appSettings = appSettingsString && JSON.parse(appSettingsString);

    runInAction(() => {
      if (appSettings) {
        this._appSettings = appSettings;
      }
    });
  };

  toggleManageTaps = async (): Promise<void> => {
    await this.updateAppSettings({
      manageTapsEnabled: !this._appSettings.manageTapsEnabled,
    });
  };

  toggleMultiAccountMode = async (): Promise<void> => {
    await this.updateAppSettings({
      multiAccountModeEnabled: !this._appSettings.multiAccountModeEnabled,
    });
  };

  @action
  updateAppSettings = async (
    appSettings: $Shape<AppSettings>,
  ): Promise<void> => {
    this._appSettings = { ...this._appSettings, ...appSettings };
    await AsyncStorage.setItem(
      APP_SETTINGS_STORAGE_KEY,
      JSON.stringify(this._appSettings),
    );
  };

  @computed
  get manageTapsEnabled(): boolean {
    return this._appSettings.manageTapsEnabled;
  }

  @computed
  get multiAccountModeEnabled(): boolean {
    return this._appSettings.multiAccountModeEnabled;
  }
}

export default AppSettingsStore;
