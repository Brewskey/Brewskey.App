// @flow

import type { Coordinates, NearbyLocation } from '../types';
import type { IComponentStore } from './types';

import { action, computed, observable } from 'mobx';
import { LoadObject } from 'brewskey.js-api';
import CommonApi from '../CommonApi';

class NearbyLocationsStore implements IComponentStore {
  @observable
  nearbyLocationLoader: LoadObject<Array<NearbyLocation>> = LoadObject.empty();
  @observable _coordinates: ?Coordinates = null;

  initialize = () => {
    CommonApi.subscribe(this._recomputeNearbyLocations);
  };

  dispose = () => {
    CommonApi.unsubscribe(this._recomputeNearbyLocations);
  };

  @action
  setCoordinatesAndFetch = (coordinates: Coordinates) => {
    this._coordinates = coordinates;
    this._recomputeNearbyLocations();
  };

  @computed
  get all(): Array<NearbyLocation> {
    return !this.nearbyLocationLoader.hasValue()
      ? []
      : this.nearbyLocationLoader
          .getValueEnforcing()
          .filter(
            (nearbyLocation: NearbyLocation): boolean =>
              !!nearbyLocation.taps.length,
          );
  }

  @action
  _recomputeNearbyLocations = () => {
    if (!this._coordinates) {
      return;
    }

    this.nearbyLocationLoader = CommonApi.fetchNearbyLocations(
      this._coordinates,
    );
  };
}

export default NearbyLocationsStore;
