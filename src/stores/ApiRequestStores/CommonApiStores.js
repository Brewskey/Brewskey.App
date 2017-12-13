// @flow

import type { Coordinates, NearbyLocation } from '../types';

import makeApiRequestStore, {
  deepIdCast,
  fetchJSON,
} from './makeRequestApiStore';
import AuthStore from '../AuthStore';
import CONFIG from '../../config';

export const NearbyLocationsStore = makeApiRequestStore(
  (
    { latitude, longitude }: Coordinates,
    radius: ?number = 15000,
  ): Promise<Array<NearbyLocation>> =>
    fetchJSON(
      `${CONFIG.HOST}/api/v2/Locations/Nearby/?longitude=${
        longitude
      }&latitude=${latitude}&radius=${radius}
      `,
      {
        headers: {
          Authorization: `Bearer ${AuthStore.token || ''}`,
        },
      },
    ).then(deepIdCast),
);

export const UpdateAvatarStore = makeApiRequestStore(
  (avatarData: string): Promise<void> =>
    // eslint-disable-next-line no-undef
    fetch(`${CONFIG.HOST}api/profile/photo`, {
      body: JSON.stringify({ photo: avatarData }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${AuthStore.token || ''}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    }),
);
