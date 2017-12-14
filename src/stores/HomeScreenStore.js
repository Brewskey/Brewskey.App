// @flow

import type { Coordinates, NearbyLocation } from '../types';

import { action, computed, observable } from 'mobx';
import { LoadObject } from 'brewskey.js-api';
import debounce from 'lodash.debounce';
import { GPSCoordinatesStore } from '../stores/ApiRequestStores/GPSApiStores';
import { GoogleCoordinatesStore } from '../stores/ApiRequestStores/GoogleApiStores';
import { NearbyLocationsStore } from '../stores/ApiRequestStores/CommonApiStores';

const SEARCH_TEXT_DEBOUNCE_TIMEOUT = 1000;

class HomeScreenStore {
  @observable isSearchBarVisible = false;
  @observable searchText = '';
  @observable _debouncedSearchText = '';

  @action
  onSearchTextChange = (text: string) => {
    this.searchText = text;
    this._setDebouncedSearchText(text);
  };

  @action
  toggleSearchBar = () => {
    this.isSearchBarVisible = !this.isSearchBarVisible;
    GPSCoordinatesStore.flushCache();
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
    if (this.isSearchBarVisible) {
      if (!this._debouncedSearchText) {
        return LoadObject.empty();
      }

      return GoogleCoordinatesStore.get(this._debouncedSearchText);
    }

    return GPSCoordinatesStore.get();
  }

  @computed
  get _nearbyLocationsLoader(): LoadObject<Array<NearbyLocation>> {
    return this._coordinatesLoader.map((coordinates: Coordinates): LoadObject<
      Array<NearbyLocation>,
    > => NearbyLocationsStore.get(coordinates));
  }

  _setDebouncedSearchText = debounce(
    action((text: string) => {
      this._debouncedSearchText = text;
    }),
    SEARCH_TEXT_DEBOUNCE_TIMEOUT,
  );
}

export default new HomeScreenStore();
