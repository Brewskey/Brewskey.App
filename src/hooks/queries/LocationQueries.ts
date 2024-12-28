import { useQuery } from '@tanstack/react-query';
import { Coordinates, LocationDAO } from '@brewskey/js-api';
import { NearbyLocation } from '../../types';

const QUERY_KEY_BASE = 'GET_COORDINATES_FROM_ADDRESS';

export const useGetNearbyLocations = (
  parameters: Coordinates & { radius?: number },
  {
    enabled,
  }: {
    enabled: boolean;
  },
) => {
  return useQuery({
    queryKey: [QUERY_KEY_BASE, parameters],
    queryFn: () =>
      LocationDAO.getNearbyLocations({
        radius: 15_000,
        ...parameters,
      }) as unknown as Promise<NearbyLocation[]>,
    enabled,
  });
};

// todo move to secure please when it will be real key
// const API_KEY = 'AIzaSyD_ZzDpXh6LAuoK7XaSecZqhnF0si6Eak0';

// const getCoordinatesFromGeoResponse = ({
//   results,
//   status,
// }: Object): Coordinates => {
//   if (status !== 'OK') {
//     throw new Error('wrong geolocation response');
//   }

//   if (!results.length) {
//     throw new Error('wrong address');
//   }

//   const { lat, lng } = results[0].geometry.location;

//   return { latitude: lat, longitude: lng };
// };

// export const GoogleCoordinatesStore = makeRequestApiStore<Coordinates>(
//   (address: string) =>
//     fetchJSON(
//       'https://maps.googleapis.com/maps/api/geocode/json' +
//         `?address=${address}&key=${API_KEY}`,
//     ).then(getCoordinatesFromGeoResponse),
// );
