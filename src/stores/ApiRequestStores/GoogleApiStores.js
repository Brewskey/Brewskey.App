// @flow

import type { Coordinates } from '../../types';

import makeRequestApiStore, { fetchJSON } from './makeRequestApiStore';

// todo move to secure please when it will be real key
const API_KEY = 'AIzaSyD_ZzDpXh6LAuoK7XaSecZqhnF0si6Eak0';

const getCoordinatesFromGeoResponse = ({
  results,
  status,
}: Object): Coordinates => {
  if (status !== 'OK') {
    throw new Error('wrong geolocation response');
  }

  if (!results.length) {
    throw new Error('wrong address');
  }

  const { lat, lng } = results[0].geometry.location;

  return { latitude: lat, longitude: lng };
};

export const GoogleCoordinatesStore = makeRequestApiStore(
  (address: string): Promise<Coordinates> =>
    fetchJSON(
      'https://maps.googleapis.com/maps/api/geocode/json' +
        `?address=${address}&key=${API_KEY}`,
    ).then(getCoordinatesFromGeoResponse),
);
