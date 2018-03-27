// @flow

import type { Coordinates, NearbyLocation } from '../types';

import { action, computed } from 'mobx';
import { LoadObject } from 'brewskey.js-api';
import DebouncedTextStore from './DebouncedTextStore';
import { GPSCoordinatesStore } from '../stores/ApiRequestStores/GPSApiStores';
import { GoogleCoordinatesStore } from '../stores/ApiRequestStores/GoogleApiStores';
import { NearbyLocationsStore } from '../stores/ApiRequestStores/CommonApiStores';

class HomeScreenStore {
  searchTextStore: DebouncedTextStore = new DebouncedTextStore();

  @action
  onClearSearchBar = () => {
    GPSCoordinatesStore.flushCache();
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
      this._coordinatesLoader.isLoading() ||
      this._nearbyLocationsLoader.isLoading()
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
      : GPSCoordinatesStore.get();
  }

  @computed
  get _nearbyLocationsLoader(): LoadObject<Array<NearbyLocation>> {
    return this._coordinatesLoader.map((coordinates: Coordinates): LoadObject<
      Array<NearbyLocation>,
    > => NearbyLocationsStore.get(coordinates));
  }
}

export default new HomeScreenStore();
