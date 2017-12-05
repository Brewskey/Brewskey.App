// @flow

import type { Coordinates } from './types';

export const createRange = (start: number, end: number): Array<number> =>
  [...Array(1 + end - start).keys()].map(
    (index: number): number => start + index,
  );

export const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const getCurrentGPSCoordinates = (): Promise<Coordinates> =>
  new Promise((resolve, reject: (error: PositionError) => void) =>
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
