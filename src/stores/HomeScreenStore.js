// @flow

import type { Coordinates } from '../types';

import { action, computed, observable } from 'mobx';
import { LoadObject } from 'brewskey.js-api';
import debounce from 'lodash.debounce';
import GoogleApi from '../GoogleApi';
import GPSApi from '../GPSApi';
import CommonApi from '../CommonApi';

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
  };

  @computed
  get isLoading(): Boolean {
    return (
      this._coordinatesLoader.isLoading() ||
      this._nearbyLocationsLoader.isLoading()
    );
  }

  @computed
  get nearbyLocations(): Array<LoadObject<NearbyLocation>> {
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

      return GoogleApi.getCoordinates(this._debouncedSearchText);
    }

    return GPSApi.getCoordinates();
  }

  @computed
  get _nearbyLocationsLoader(): LoadObject<Array<LoadObject<NearbyLocation>>> {
    return this._coordinatesLoader.map((coordinates: CommonApi): Array<
      LoadObject<NearbyLocation>,
    > => CommonApi.fetchNearbyLocations(coordinates));
  }

  _setDebouncedSearchText = debounce(
    action((text: string) => {
      this._debouncedSearchText = text;
    }),
    SEARCH_TEXT_DEBOUNCE_TIMEOUT,
  );
}

export default new HomeScreenStore();
