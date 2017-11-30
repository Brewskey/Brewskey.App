// @flow

import type { Coordinates } from './types';

import AuthStore from './stores/AuthStore';
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

class CommonApi {
  static fetchNearbyLocations = async (
    { latitude, longitude }: Coordinates,
    radius?: number = 15000,
  ): Promise<Array<Object>> => {
    // eslint-disable-next-line no-undef
    const response = await fetch(
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

    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.error_description);
    }

    return deepIdCast(responseJson);
  };

  static updateAvatar = (avatarData: string): Promise<void> =>
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

export default CommonApi;
