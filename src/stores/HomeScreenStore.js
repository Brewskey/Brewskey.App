// @flow

import type { Coordinates, NearbyLocation } from '../types';
import type { IComponentStore } from './types';

import { action, computed, observable, reaction, runInAction } from 'mobx';
import debounce from 'lodash.debounce';
import { LoadObject } from 'brewskey.js-api';
import GoogleApi from '../GoogleApi';
import NearbyLocationsStore from '../stores/NearbyLocationsStore';
import { getCurrentGPSCoordinates } from '../utils';

const SEARCH_TEXT_DEBOUNCE_TIMEOUT = 1000;

class HomeScreenStore implements IComponentStore {
  _nearbyLocationsStore = new NearbyLocationsStore();

  _changeSearchTextReactionDispose: () => void;
  _closeSearchBarReactionDispose: () => void;
  _gspLoaderReactonDispose: () => void;
  _searchCoordinatesReactionDispose: () => void;

  @observable isSearchBarVisible: boolean = false;
  @observable searchText: string = '';
  @observable
  _searchCoordinatesLoader: LoadObject<Coordinates> = LoadObject.empty();
  @observable
  _gpsCoordinatesLoader: LoadObject<Coordinates> = LoadObject.empty();

  initialize = () => {
    this._nearbyLocationsStore.initialize();

    GoogleApi.subscribe(this._recomputeSearchCoordinates);

    // todo don't know if this is good decision: using reaction for
    // invoke action in another store
    this._gspLoaderReactonDispose = reaction(
      (): LoadObject<Coordinates> => this._gpsCoordinatesLoader,
      this._onNewCoordinatesLoader,
    );

    this._searchCoordinatesReactionDispose = reaction(
      (): LoadObject<Coordinates> => this._searchCoordinatesLoader,
      this._onNewCoordinatesLoader,
    );

    this._closeSearchBarReactionDispose = reaction(
      (): boolean => this.isSearchBarVisible,
      this._recomputeCurrentGPSCoordinates,
      /* fireImmediately */ true,
    );

    this._changeSearchTextReactionDispose = reaction(
      (): string => this.searchText,
      debounce(this._recomputeSearchCoordinates, SEARCH_TEXT_DEBOUNCE_TIMEOUT),
    );
  };

  dispose = () => {
    this._nearbyLocationsStore.dispose();
    GoogleApi.unsubscribe(this._recomputeSearchCoordinates);
    this._changeSearchTextReactionDispose();
    this._closeSearchBarReactionDispose();
    this._gspLoaderReactonDispose();
    this._searchCoordinatesReactionDispose();
  };

  @action
  onChangeSearchText = (searchText: string) => {
    this.searchText = searchText;
  };

  @action
  toggleSearchBar = () => {
    if (this.isSearchBarVisible) {
      this.hideSearchBar();
    } else {
      this.openSearchBar();
    }
  };

  @action
  openSearchBar = () => {
    this.isSearchBarVisible = true;
  };

  @action
  hideSearchBar = () => {
    this.isSearchBarVisible = false;
    this.searchText = '';
    this._recomputeCurrentGPSCoordinates();
  };

  @computed
  get isLoading(): boolean {
    return (
      this._gpsCoordinatesLoader.isLoading() ||
      this._searchCoordinatesLoader.isLoading() ||
      this._nearbyLocationsStore.nearbyLocationLoader.isLoading()
    );
  }

  @computed
  get nearbyLocations(): Array<NearbyLocation> {
    return this._nearbyLocationsStore.all;
  }

  @action
  _recomputeCurrentGPSCoordinates = async (): Promise<void> => {
    this._gpsCoordinatesLoader = LoadObject.loading();
    try {
      const coordinates = await getCurrentGPSCoordinates();

      runInAction(() => {
        this._gpsCoordinatesLoader = LoadObject.withValue(coordinates);
      });
    } catch (error) {
      runInAction(() => {
        this._gpsCoordinatesLoader = LoadObject.withError(error);
      });
    }
  };

  @action
  _recomputeSearchCoordinates = () => {
    if (!this.searchText) {
      return;
    }

    this._searchCoordinatesLoader = GoogleApi.fetchCoordinatesByAddress(
      this.searchText,
    );
  };

  _onNewCoordinatesLoader = (coordantesLoader: LoadObject<Coordinates>) => {
    if (coordantesLoader.hasValue()) {
      this._nearbyLocationsStore.setCoordinatesAndFetch(
        coordantesLoader.getValueEnforcing(),
      );
    }
  };
}

export default HomeScreenStore;
