// @flow

import type { EntityID } from 'brewskey.js-api';

import { action, computed, observable, reaction, runInAction } from 'mobx';
import DAOApi from 'brewskey.js-api';
import AuthStore from './AuthStore';
import { OrganizationStore, waitForLoaded } from './DAOStores';
import Storage from '../Storage';

const APP_SETTINGS_STORAGE_KEY = 'app_settings';

type AppSettings = {|
  manageTapsEnabled: boolean,
  selectedOrganizationID: ?EntityID,
|};

class AppSettingsStore {
  @observable
  _appSettings = {
    manageTapsEnabled: false,
    selectedOrganizationID: null,
  };

  constructor() {
    reaction(
      () => AuthStore.isAuthorized,
      (isAuthorized: boolean) => {
        if (!isAuthorized) {
          return;
        }
        this._rehydrateAppSettings();
      },
    );
  }

  _rehydrateAppSettings = async () => {
    const appSettings = await Storage.getForCurrentUser(
      APP_SETTINGS_STORAGE_KEY,
    );

    runInAction(() => {
      if (appSettings) {
        this._appSettings = appSettings;
      }

      if (this._appSettings.selectedOrganizationID) {
        DAOApi.setOrganizationID(appSettings.selectedOrganizationID);
      } else if (this._appSettings.selectedOrganizationID === undefined) {
        (async () => {
          const organizations = await waitForLoaded(() =>
            OrganizationStore.getMany(),
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
    this.updateAppSettings({
      selectedOrganizationID: selectedOrganizationID || null,
    });
  };

  onToggleManageTaps = () => {
    this.updateAppSettings({
      manageTapsEnabled: !this._appSettings.manageTapsEnabled,
    });
  };

  @action
  updateAppSettings = (appSettings: $Shape<AppSettings>) => {
    this._appSettings = { ...this._appSettings, ...appSettings };
    Storage.setForCurrentUser(APP_SETTINGS_STORAGE_KEY, this._appSettings);
  };

  @computed
  get isManageTapsEnabled(): boolean {
    return this._appSettings.manageTapsEnabled;
  }

  @computed
  get selectedOrganizationID(): ?EntityID {
    return this._appSettings.selectedOrganizationID;
  }
}

export default new AppSettingsStore();
