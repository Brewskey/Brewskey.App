// @flow

import type { Coordinates, NearbyLocation } from '../types';

import { action, computed } from 'mobx';
import OpenAppSettings from 'react-native-app-settings';
import { AppState } from 'react-native';
import { LoadObject } from 'brewskey.js-api';
import DebouncedTextStore from './DebouncedTextStore';
import { GPSCoordinatesStore } from '../stores/ApiRequestStores/GPSApiStores';
import { GoogleCoordinatesStore } from '../stores/ApiRequestStores/GoogleApiStores';
import { NearbyLocationsStore } from '../stores/ApiRequestStores/CommonApiStores';
import {
  LOCATION_PERMISSION_STATUSES,
  LocationPermissionStore,
} from '../stores/ApiRequestStores/PermissionStores';

class HomeScreenStore {
  searchTextStore: DebouncedTextStore = new DebouncedTextStore();

  @action
  onClearSearchBar = () => {
    GPSCoordinatesStore.flushCache();
  };

  @action
  onAskLocationPermissionButtonPress = () => {
    if (
      LocationPermissionStore.get().getValue() ===
      LOCATION_PERMISSION_STATUSES.DENIED
    ) {
      LocationPermissionStore.flushCache();
    } else {
      const onAppStateChange = appState => {
        if (appState !== 'active') {
          return;
        }
        LocationPermissionStore.flushCache();
        AppState.removeEventListener('change', onAppStateChange);
      };
      AppState.addEventListener('change', onAppStateChange);

      OpenAppSettings.open();
    }
  };

  @action
  refresh = () => {
    if (this.searchTextStore.debouncedText) {
      NearbyLocationsStore.flushCache();
    } else {
      GPSCoordinatesStore.flushCache();
    }
  };

  @computed
  get isLoading(): boolean {
    return (
      LocationPermissionStore.get().isLoading() ||
      this._coordinatesLoader.isLoading() ||
      this._nearbyLocationsLoader.isLoading()
    );
  }

  @computed
  get isAskLocationPermissionVisible(): boolean {
    return (
      !this.searchTextStore.debouncedText &&
      (LocationPermissionStore.get().getValue() ===
        LOCATION_PERMISSION_STATUSES.DENIED ||
        LocationPermissionStore.get().getValue() ===
          LOCATION_PERMISSION_STATUSES.RESTRICTED)
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
      : LocationPermissionStore.get().map(
          permissionStatus =>
            permissionStatus === LOCATION_PERMISSION_STATUSES.AUTHORIZED
              ? GPSCoordinatesStore.get()
              : LoadObject.empty(),
        );
  }

  @computed
  get _nearbyLocationsLoader(): LoadObject<Array<NearbyLocation>> {
    return this._coordinatesLoader.map((coordinates: Coordinates): LoadObject<
      Array<NearbyLocation>,
    > => NearbyLocationsStore.get(coordinates));
  }
}

export default new HomeScreenStore();
