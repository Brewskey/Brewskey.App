// @flow

import type { Organization } from 'brewskey.js-api';

import { action, computed, observable, reaction, runInAction } from 'mobx';
import DAOApi from 'brewskey.js-api';
import AuthStore from './AuthStore';
import { OrganizationStore, waitForLoaded } from './DAOStores';
import Storage from '../Storage';
import codePush from 'react-native-code-push';

const APP_SETTINGS_STORAGE_KEY = 'app_settings';

type AppSettings = {|
  manageTapsEnabled: boolean,
  selectedOrganization: ?Organization,
|};

class AppSettingsStore {
  @observable
  _appSettings = {
    manageTapsEnabled: false,
    selectedOrganization: null,
  };

  @observable
  updateMetadata: ?{|
    appVersion: string,
    label: string,
  |} = null;

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

    runInAction(async () => {
      this.updateMetadata = await codePush.getUpdateMetadata();

      if (appSettings) {
        this._appSettings = appSettings;
      }

      if (this._appSettings.selectedOrganization) {
        DAOApi.setOrganizationID(appSettings.selectedOrganization.id);
      } else if (this._appSettings.selectedOrganization === undefined) {
        (async () => {
          const organizations = await waitForLoaded(() =>
            OrganizationStore.getMany(),
          );

          if (organizations.length) {
            const selectedOrganization = organizations[0].getValueEnforcing();

            DAOApi.setOrganizationID(selectedOrganization.id);
            this.updateAppSettings({
              selectedOrganization,
            });
          }
        })();
      }
    });
  };

  onOrganizationChange = (selectedOrganization: ?Organization) => {
    DAOApi.setOrganizationID(
      selectedOrganization ? selectedOrganization.id : null,
    );
    this.updateAppSettings({
      selectedOrganization: selectedOrganization || null,
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
  get selectedOrganization(): ?Organization {
    return this._appSettings.selectedOrganization;
  }
}

export default new AppSettingsStore();
