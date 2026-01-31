import { makeRequestApiStore } from 'stores/ApiRequestStores/makeRequestApiStore';
import { CONFIG } from 'config';

import type { EntityID } from '@brewskey/js-api';

// const makeNearbyLocationsStore = () => {
//   const store = makeApiRequestStore<Array<NearbyLocation>>(
//     ({ latitude, longitude }: Coordinates, radius: number = 15000) =>
//       fetchJSON(
//         `${CONFIG.HOST}/api/v2/Locations/Default.nearby()/?longitude=${longitude}&latitude=${latitude}&radius=${radius}
//     `,
//         {
//           headers: {
//             Authorization: `Bearer ${AuthStore.accessToken || ''}`,
//           },
//         },
//       ).then(deepIdCast),
//   );

//   // todo very heavy subscription. fix this after we implement returning
//   // event types for subscribe callbacks.
//   // DAOApi.LocationDAO.subscribe(store.flushCache);

//   return store;
// };

// export const NearbyLocationsStore = makeNearbyLocationsStore();

const iter = 0;
export const updateAvatar = async (
  avatarData: string,
  accessToken: string | null,
) =>
  fetch(`${CONFIG.HOST}/api/profile/photo/`, {
    body: JSON.stringify({ photo: avatarData }),
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken || ''}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });

export const UpdateBeverageImageStore = makeRequestApiStore<void>(
  async (...args: unknown[]) => {
    const beverageID = args[0] as EntityID;
    const beverageData = args[1] as string;
    const accessToken = args[2] as string | null;

    return fetch(`${CONFIG.HOST}/api/v2/beverages/${beverageID}/photo/`, {
      body: JSON.stringify({ photo: beverageData }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken || ''}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    }).then(() => {});
  },
);
