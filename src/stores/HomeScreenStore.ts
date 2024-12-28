import type { Coordinates, NearbyLocation } from '../types';

import * as Linking from 'expo-linking';
import { AppState } from 'react-native';
import { GPSCoordinatesStore } from '../stores/ApiRequestStores/GPSApiStores';
import * as Location from 'expo-location';
class HomeScreenStore {
  searchTextStore: { debouncedText: string | null } = { debouncedText: null };

  _refresh = 0;

  onClearSearchBar: () => void = () => {
    GPSCoordinatesStore.flushCache();
  };

  refresh: () => void = () => {
    if (this.searchTextStore.debouncedText) {
    } else {
      GPSCoordinatesStore.flushCache();
    }

    // this.searchTextStore.setText('');
    this._refresh += 1;
  };

  get nearbyLocations(): Promise<Array<NearbyLocation>> {
    return this._nearbyLocationsLoader;
  }

  get _coordinatesLoader(): Promise<Coordinates> {
    // return this.searchTextStore.debouncedText
    //   ? GoogleCoordinatesStore.get(this.searchTextStore.debouncedText)
    //   : GPSCoordinatesStore.get();

    return Promise.reject();
  }

  get _nearbyLocationsLoader(): Promise<Array<NearbyLocation>> {
    return Promise.reject();
    // return this._coordinatesLoader.then(
    //   (coordinates: Coordinates): Promise<Array<NearbyLocation>> => {
    //     return NearbyLocationsStore.get(coordinates);
    //   },
    // );
  }
}

export default new HomeScreenStore();
