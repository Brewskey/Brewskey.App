// @flow

import AppSettingsStore from './AppSettingsStore';
import NearbyLocationsStore from './NearbyLocationsStore';
import AuthStore from './AuthStore';

class RootStore {
  appSettingsStore: AppSettingsStore;
  authStore: AuthStore;

  nearbyLocationsStore: NearbyLocationsStore;

  constructor() {
    this.appSettingsStore = new AppSettingsStore(this);
    this.authStore = new AuthStore(this);

    this.nearbyLocationsStore = new NearbyLocationsStore(this);
  }

  // todo not sure if its correct, since assignements in initialize actions,
  // runs in callbacks, but seems working for now.
  initialize = async (): Promise<void> => {
    await this.authStore.initialize();
    await this.appSettingsStore.initialize();
  };
}

export default RootStore;
