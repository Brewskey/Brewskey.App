// @flow

import type { Coordinates, NearbyLocation } from '../types';
import type { LocationPermissionStatus } from '../stores/ApiRequestStores/PermissionStores';

import { action, computed } from 'mobx';
import OpenAppSettings from 'react-native-app-settings';
import { AppState } from 'react-native';
import { LoadObject } from 'brewskey.js-api';
import DebouncedTextStore from './DebouncedTextStore';
import { GPSCoordinatesStore } from '../stores/ApiRequestStores/GPSApiStores';
import { GoogleCoordinatesStore } from '../stores/ApiRequestStores/GoogleApiStores';
import { NearbyLocationsStore } from '../stores/ApiRequestStores/CommonApiStores';
import { LocationPermissionStore } from '../stores/ApiRequestStores/PermissionStores';

class HomeScreenStore {
  searchTextStore: DebouncedTextStore = new DebouncedTextStore();

  @action
  onClearSearchBar: () => void = () => {
    GPSCoordinatesStore.flushCache();
  };

  @action
  onAskLocationPermissionButtonPress: () => void = () => {
    if (LocationPermissionStore.hasLocationPermissions()) {
      LocationPermissionStore.flushCache();
    } else {
      const onAppStateChange = (appState) => {
        if (appState !== 'active') {
          return;
        }
        LocationPermissionStore.flushCache();
        this.refresh();
        AppState.removeEventListener('change', onAppStateChange);
      };
      AppState.addEventListener('change', onAppStateChange);

      OpenAppSettings.open();
    }
  };

  @action
  refresh: () => void = () => {
    if (this.searchTextStore.debouncedText) {
      GoogleCoordinatesStore.flushCache();
    } else {
      GPSCoordinatesStore.flushCache();
      LocationPermissionStore.flushCache();
    }

    NearbyLocationsStore.flushCache();
  };

  @computed
  get isLoading(): boolean {
    return (
      LocationPermissionStore.isLoadingPermissions() ||
      this._coordinatesLoader.isLoading() ||
      this._nearbyLocationsLoader.isLoading()
    );
  }

  @computed
  get isAskLocationPermissionVisible(): boolean {
    return (
      !this.searchTextStore.debouncedText &&
      !LocationPermissionStore.hasLocationPermissions()
    );
  }

  @computed
  get nearbyLocations(): Array<NearbyLocation> {
    return this._nearbyLocationsLoader.hasValue()
      ? this._nearbyLocationsLoader.getValueEnforcing()
      : [];
  }

  @computed
  get _coordinatesLoader(): LoadObject<Coordinates> {
    return this.searchTextStore.debouncedText
      ? GoogleCoordinatesStore.get(this.searchTextStore.debouncedText)
      : LocationPermissionStore.hasLocationPermissions()
      ? GPSCoordinatesStore.get()
      : LoadObject.empty();
  }

  @computed
  get _nearbyLocationsLoader(): LoadObject<Array<NearbyLocation>> {
    return this._coordinatesLoader.map((coordinates: Coordinates): LoadObject<
      Array<NearbyLocation>,
    > => NearbyLocationsStore.get(coordinates));
  }
}

export default new HomeScreenStore();
