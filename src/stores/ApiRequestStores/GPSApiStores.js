// @flow

import type { Coordinates } from '../../types';
import makeRequestApiStore from './makeRequestApiStore';

const getGPSPosition = (): Promise<Position> =>
  new Promise((resolve, reject: (error: PositionError) => void) =>
    // eslint-disable-next-line no-undef
    navigator.geolocation.getCurrentPosition(
      (position: Position): void => resolve(position),
      (error: PositionError): void => reject(error),
    ),
  );

export const createGPSCoordinatesStore = () =>
  makeRequestApiStore((): Promise<Coordinates> =>
    getGPSPosition().then((position: Position): Coordinates => ({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })),
  );

export const GPSCoordinatesStore = createGPSCoordinatesStore();
