import { makeRequestApiStore } from 'stores/ApiRequestStores/makeRequestApiStore';

import type { Coordinates } from 'types';

// const getGPSPosition = (): Promise<Position> => new Promise((resolve, reject: (error: PositionError) => void) => {
//   Geolocation.getCurrentPosition(
//     (position: Position): void => {
//       resolve(position);
//       console.log(position);
//     },
//     (error: PositionError): void => {
//       console.error(error);
//       reject(error);
//     },
//     { enableHighAccuracy: true }
//   );
// });

interface Position {
  coords: {
    latitude: number;
    longitude: number;
  };
}

const getGPSPosition = async (): Promise<Position> => Promise.reject();

export const createGPSCoordinatesStore = () =>
  makeRequestApiStore<Coordinates>(async () =>
    getGPSPosition().then(
      (position: Position): Coordinates => ({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }),
    ),
  );

export const GPSCoordinatesStore = createGPSCoordinatesStore();
