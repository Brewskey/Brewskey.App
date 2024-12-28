import type { Coordinates } from '../../types';
import makeRequestApiStore from './makeRequestApiStore';

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

type Position = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

const getGPSPosition = (): Promise<Position> => Promise.reject();

export const createGPSCoordinatesStore = () =>
  makeRequestApiStore<Coordinates>(() =>
    getGPSPosition().then((position: Position): Coordinates => {
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    }),
  );

export const GPSCoordinatesStore = createGPSCoordinatesStore();
