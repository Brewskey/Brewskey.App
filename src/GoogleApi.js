// @flow

import type { Coordinates } from './types';

import nullthrows from 'nullthrows';
import { LoadObject } from 'brewskey.js-api';
import BaseApi, { doRequest } from './BaseApi';

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
  fetchCoordinatesByAddress = (address: string): LoadObject<Coordinates> => {
    const cacheKey = this.__getCacheKey('fetchCoordinatesByAddress', address);

    if (!this.__requestLoaderByKey.has(cacheKey)) {
      this.__requestLoaderByKey.set(cacheKey, LoadObject.loading());
      this.__emitChanges();

      doRequest(
        'https://maps.googleapis.com/maps/api/geocode/json' +
          `?address=${address}&key=${API_KEY}`,
      )
        .then((response: Object) => {
          const coordinates = getCoordinatesFromGeoResponse(response);
          this.__requestLoaderByKey.set(
            cacheKey,
            LoadObject.withValue(coordinates),
          );
          this.__emitChanges();
        })
        .catch(error => {
          this.__requestLoaderByKey.set(cacheKey, LoadObject.withError(error));
          this.__emitChanges();
        });
    }

    return nullthrows(this.__requestLoaderByKey.get(cacheKey));
  };
}

export default new GoogleApi();
