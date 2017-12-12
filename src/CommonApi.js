// @flow

import type { Coordinates, NearbyLocation } from './types';

import { LoadObject } from 'brewskey.js-api';
import AuthStore from './stores/AuthStore';
import BaseApi, { fetchJSON } from './BaseApi';
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
    coordinates: Coordinates,
    radius?: number = 15000,
  ): LoadObject<Array<NearbyLocation>> => {
    const cacheKey = this.__getCacheKey(
      'fetchNearbyLocations',
      coordinates,
      radius,
    );

    const { latitude, longitude } = coordinates;

    return this.__getRequestLoader(
      { cacheKey, transformResponse: deepIdCast },
      fetchJSON,
      `${CONFIG.HOST}/api/v2/Locations/Nearby/?longitude=${
        longitude
      }&latitude=${latitude}&radius=${radius}
      `,
      {
        headers: {
          Authorization: `Bearer ${AuthStore.token || ''}`,
        },
      },
    );
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
