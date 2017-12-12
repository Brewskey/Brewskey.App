// @flow

import type { Coordinates } from './types';

import { LoadObject } from 'brewskey.js-api';
import BaseApi, { fetchJSON } from './BaseApi';

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

class GoogleApi extends BaseApi {
  getCoordinates = (address: string): LoadObject<Coordinates> => {
    const cacheKey = this.__getCacheKey('getGoogleCoordinates', address);
    return this.__getRequestLoader(
      { cacheKey, transformResponse: getCoordinatesFromGeoResponse },
      fetchJSON,
      'https://maps.googleapis.com/maps/api/geocode/json' +
        `?address=${address}&key=${API_KEY}`,
    );
  };
}

export default new GoogleApi();
