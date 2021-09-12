// @flow

import type { Coordinates, NearbyLocation } from '../types';

import { action, computed, observable, runInAction } from 'mobx';
import OpenAppSettings from 'react-native-app-settings';
import { PermissionsAndroid, Platform } from 'react-native';
import { AppState } from 'react-native';
import { LoadObject } from 'brewskey.js-api';
import DebouncedTextStore from './DebouncedTextStore';
import { GPSCoordinatesStore } from '../stores/ApiRequestStores/GPSApiStores';
import { GoogleCoordinatesStore } from '../stores/ApiRequestStores/GoogleApiStores';
import { NearbyLocationsStore } from '../stores/ApiRequestStores/CommonApiStores';
import PermissionStore from '../stores/ApiRequestStores/PermissionStores';
import {
  RESULTS,
} from 'react-native-permissions';

class HomeScreenStore {
  searchTextStore: DebouncedTextStore = new DebouncedTextStore();
  @observable _refresh = 0;

  @action
  onClearSearchBar: () => void = () => {
    GPSCoordinatesStore.flushCache();
  };

  @action
  onAskLocationPermissionButtonPress: () => Promise<void> = async () => {
    try {
      const result = await PermissionStore.getLocationPermissions();
      if (result === RESULTS.GRANTED) {
        PermissionStore.flushCache();
        runInAction(() => this.refresh())
      } else if (result === RESULTS.BLOCKED) {
        const subscription = AppState.addEventListener('change', action((appState) => {
          if (appState !== 'active') {
            return;
          }
          runInAction(() => this.refresh())
          subscription.remove();
        }));
        OpenAppSettings.open();
      }
    } catch (err) {
      console.warn(err)
    }
  };

  @action
  refresh: () => void = () => {
    if (this.searchTextStore.debouncedText) {
      GoogleCoordinatesStore.flushCache();
    } else {
      GPSCoordinatesStore.flushCache();
      PermissionStore.flushCache();
    }

    NearbyLocationsStore.flushCache();
    this.searchTextStore.setText('');
    this._refresh += 1;
  };

  @computed
  get isLoading(): boolean {
    return (
      PermissionStore.isLoadingPermissions ||
      this._coordinatesLoader.isLoading() ||
      this._nearbyLocationsLoader.isLoading()
    );
  }

  @computed
  get isAskLocationPermissionVisible(): boolean {
    return (
      !this.searchTextStore.debouncedText &&
      !PermissionStore.hasLocationPermissions
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
      : PermissionStore.hasLocationPermissions
        ? GPSCoordinatesStore.get()
        : LoadObject.empty();
  }

  @computed
  get _nearbyLocationsLoader(): LoadObject<Array<NearbyLocation>> {
    return this._coordinatesLoader.map((coordinates: Coordinates): LoadObject<
      Array<NearbyLocation>,
      > => {
      return NearbyLocationsStore.get(coordinates);
    });
  }
}



export default new HomeScreenStore();
