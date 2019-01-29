// @flow

import type { EntityID } from 'brewskey.js-api';
import type { Coordinates, NearbyLocation } from '../../types';

import DAOApi from 'brewskey.js-api';
import makeApiRequestStore, { deepIdCast } from './makeRequestApiStore';
import { fetchJSON } from '../../utils';
import AuthStore from '../AuthStore';
import CONFIG from '../../config';

const makeNearbyLocationsStore = () => {
  const store = makeApiRequestStore(
    (
      { latitude, longitude }: Coordinates,
      radius?: number = 15000,
    ): Promise<Array<NearbyLocation>> =>
      fetchJSON(
        `${
          CONFIG.HOST
        }/api/v2/Locations/Default.nearby()/?longitude=${longitude}&latitude=${latitude}&radius=${radius}
      `,
        {
          headers: {
            Authorization: `Bearer ${AuthStore.accessToken || ''}`,
          },
        },
      ).then(deepIdCast),
  );

  // todo very heavy subscription. fix this after we implement returning
  // event types for subscribe callbacks.
  DAOApi.LocationDAO.subscribe(store.flushCache);

  return store;
};

export const NearbyLocationsStore = makeNearbyLocationsStore();

export const UpdateAvatarStore = makeApiRequestStore(
  (avatarData: string): Promise<void> =>
    // eslint-disable-next-line no-undef
    fetch(`${CONFIG.HOST}/api/profile/photo/`, {
      body: JSON.stringify({ photo: avatarData }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${AuthStore.accessToken || ''}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    }),
);

export const UpdateBeverageImageStore = makeApiRequestStore(
  (beverageID: EntityID, beverageData: string): Promise<void> =>
    // eslint-disable-next-line no-undef
    fetch(`${CONFIG.HOST}/api/v2/beverages/${beverageID}/photo/`, {
      body: JSON.stringify({ photo: beverageData }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${AuthStore.accessToken || ''}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    }),
);
