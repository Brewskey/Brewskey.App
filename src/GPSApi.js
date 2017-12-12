// @flow

import type { LoadObject } from 'brewskey.js-api';
import type { Coordinates } from './types';

import BaseApi from './BaseApi';

export const getGPSPosition = (): Promise<Position> =>
  new Promise((resolve, reject: (error: PositionError) => void) =>
    // eslint-disable-next-line no-undef
    navigator.geolocation.getCurrentPosition(
      (position: Position): void => resolve(position),
      (error: PositionError): void => reject(error),
    ),
  );

class GPSApi extends BaseApi {
  getCoordinates = (): LoadObject<Coordinates> => {
    const cacheKey = this.__getCacheKey('getGPSCoordinates');
    return this.__getRequestLoader(
      {
        cacheKey,
        transformResponse: (position: Position): Coordinates => ({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      },
      getGPSPosition,
    );
  };
}

export default new GPSApi();
