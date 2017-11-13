// @flow

import type RootStore from './RootStore';
import type { ObservableMap } from 'mobx';
import type { NearbyLocation } from '../types';

import { action, computed, observable, runInAction } from 'mobx';
import CommonApi from '../CommonApi';

class NearbyLocationsStore {
  _rootStore: RootStore;
  @observable _nearbyLocationsById: ObservableMap<NearbyLocation> = new Map();

  constructor(rootStore: RootStore) {
    this._rootStore = rootStore;
  }

  @action
  fetchAll = async (): Promise<Array<NearbyLocation>> => {
    try {
      const coordinates = await new Promise(
        (resolve, reject: (error: PositionError) => void) =>
          // eslint-disable-next-line no-undef
          navigator.geolocation.getCurrentPosition(
            (position: Position): void =>
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }),
            (error: PositionError) => reject(error),
          ),
      );

      const nearbyLocations = await CommonApi.fetchNearbyLocations(coordinates);

      runInAction(() => {
        this._nearbyLocationsById.merge([
          ...nearbyLocations.map((nearbyLocation: NearbyLocation): [
            string,
            NearbyLocation,
          ] => [nearbyLocation.id, nearbyLocation]),
        ]);
      });

      return nearbyLocations;
    } catch (error) {
      // todo add error handling
      return [];
    }
  };

  @computed
  get all(): Array<NearbyLocation> {
    return this._nearbyLocationsById.values();
  }

  @computed
  get allWithFilledTaps(): Array<NearbyLocation> {
    return this.all.filter(
      (nearbyLocation: NearbyLocation): boolean => !!nearbyLocation.taps.length,
    );
  }
}

export default NearbyLocationsStore;
