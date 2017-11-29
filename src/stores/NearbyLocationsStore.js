// @flow

import type { ObservableMap } from 'mobx';
import type { EntityID } from 'brewskey.js-api';
import type { NearbyLocation } from '../types';

import { action, computed, observable, runInAction } from 'mobx';
import CommonApi from '../CommonApi';

class NearbyLocationsStore {
  @observable _nearbyLocationsById: ObservableMap<NearbyLocation> = new Map();

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
            EntityID,
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
    return this._nearbyLocationsById
      .values()
      .filter(
        (nearbyLocation: NearbyLocation): boolean =>
          !!nearbyLocation.taps.length,
      );
  }
}

export default NearbyLocationsStore;
