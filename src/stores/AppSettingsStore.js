// @flow

import type RootStore from './RootStore';
import type { EntityID } from 'brewskey.js-api';

import { AsyncStorage } from 'react-native';
import { action, computed, observable, runInAction } from 'mobx';
import DAOApi from 'brewskey.js-api';

const { TapDAO, DeviceDAO, LocationDAO, OrganizationDAO } = DAOApi;

const APP_SETTINGS_STORAGE_KEY = 'app_settings';

type AppSettings = {|
  manageTapsEnabled: boolean,
  multiAccountModeEnabled: boolean,
  selectedOrganizationID: ?EntityID,
|};

// todo somehow save settings for particular user and restore them after relogin?
// or save user settings on the server?
class AppSettingsStore {
  _rootStore: RootStore;

  @observable
  _appSettings = {
    manageTapsEnabled: false,
    multiAccountModeEnabled: false,
    selectedOrganizationID: null,
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

      if (this._appSettings.selectedOrganizationID) {
        DAOApi.setOrganizationID(appSettings.selectedOrganizationID);
      } else if (this._appSettings.selectedOrganizationID === undefined) {
        (async () => {
          const organizations = await OrganizationDAO.waitForLoaded(() =>
            OrganizationDAO.fetchMany(),
          );

          if (organizations.length) {
            const selectedOrganizationID = organizations[0].getValueEnforcing()
              .id;

            DAOApi.setOrganizationID(selectedOrganizationID);
            this.updateAppSettings({
              selectedOrganizationID,
            });
          }
        })();
      }
    });
  };

  onOrganizationChange = (selectedOrganizationID: ?EntityID) => {
    DAOApi.setOrganizationID(selectedOrganizationID);
    // todo make helper inside api lib for flush cache for organization dependend
    // entitites?
    DeviceDAO.flushCache();
    LocationDAO.flushCache();
    TapDAO.flushCache();
    this.updateAppSettings({
      selectedOrganizationID: selectedOrganizationID || null,
    });
  };

  onToggleManageTaps = () => {
    this.updateAppSettings({
      manageTapsEnabled: !this._appSettings.manageTapsEnabled,
    });
  };

  onToggleMultiAccountMode = () => {
    this.updateAppSettings({
      multiAccountModeEnabled: !this._appSettings.multiAccountModeEnabled,
    });
  };

  @action
  updateAppSettings = (appSettings: $Shape<AppSettings>) => {
    this._appSettings = { ...this._appSettings, ...appSettings };
    AsyncStorage.setItem(
      APP_SETTINGS_STORAGE_KEY,
      JSON.stringify(this._appSettings),
    );
  };

  @computed
  get isManageTapsEnabled(): boolean {
    return this._appSettings.manageTapsEnabled;
  }

  @computed
  get isMultiAccountModeEnabled(): boolean {
    return this._appSettings.multiAccountModeEnabled;
  }

  @computed
  get selectedOrganizationID(): ?EntityID {
    return this._appSettings.selectedOrganizationID;
  }
}

export default AppSettingsStore;
