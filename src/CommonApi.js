// @flow

import type { Coordinates, NearbyLocation } from './types';

import nullthrows from 'nullthrows';
import { LoadObject } from 'brewskey.js-api';
import AuthStore from './stores/AuthStore';
import BaseApi, { doRequest } from './BaseApi';
import CONFIG from './config';

const deepIdCast = (node: any): any => {
  Object.keys(node).forEach((key: string) => {
    if (node[key] === Object(node[key])) {
      deepIdCast(node[key]);
    }
    if (key === 'id') {
      // eslint-disable-next-line
      node[key] = node[key].toString();
    }
  });
  return node;
};

class CommonApi extends BaseApi {
  fetchNearbyLocations = (
    coordiantes: Coordinates,
    radius?: number = 15000,
  ): LoadObject<Array<NearbyLocation>> => {
    const cacheKey = this.__getCacheKey(
      'fetchNearbyLocations',
      coordiantes,
      radius,
    );

    if (!this.__requestLoaderByKey.has(cacheKey)) {
      this.__requestLoaderByKey.set(cacheKey, LoadObject.loading());
      this.__emitChanges();

      const { latitude, longitude } = coordiantes;
      doRequest(
        `${CONFIG.HOST}/api/v2/Locations/Nearby/?longitude=${
          longitude
        }&latitude=${latitude}&radius=${radius}
    `,
        {
          headers: {
            Authorization: `Bearer ${AuthStore.token || ''}`,
          },
        },
      )
        .then((result: Array<Object>) => {
          this.__requestLoaderByKey.set(
            cacheKey,
            LoadObject.withValue(deepIdCast(result)),
          );
          this.__emitChanges();
        })
        .catch((error: Error) => {
          this.__requestLoaderByKey.set(cacheKey, LoadObject.withError(error));
          this.__emitChanges();
        });
    }

    return nullthrows(this.__requestLoaderByKey.get(cacheKey));
  };

  updateAvatar = (avatarData: string): Promise<void> =>
    // eslint-disable-next-line no-undef
    fetch(`${CONFIG.HOST}api/profile/photo`, {
      body: JSON.stringify({ photo: avatarData }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${AuthStore.token || ''}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
}

export default new CommonApi();
