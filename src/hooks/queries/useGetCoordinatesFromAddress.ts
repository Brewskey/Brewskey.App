import { useQuery } from '@tanstack/react-query';
import nullthrows from 'nullthrows';

import { GOOGLE_MAPS_API_KEY } from '../../constants';
import { fetchJSON } from '../../utils';

const QUERY_KEY_BASE = 'GET_COORDINATES_FROM_ADDRESS';

interface ApiResult {
  status: string;
  results: { geometry: { location: { lat: number; lng: number } } }[];
}

export const useGetCoordinatesFromAddress = (address: string | undefined) =>
  useQuery({
    queryKey: [QUERY_KEY_BASE, address],
    queryFn: async () => {
      const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
      url.searchParams.set('key', GOOGLE_MAPS_API_KEY);
      url.searchParams.set('address', nullthrows(address));
      return fetchJSON(url.toString()) as unknown as Promise<ApiResult>;
    },
    enabled: address != null,
    select: ({ status, results }: ApiResult) => {
      if (status !== 'OK') {
        throw new Error('wrong geolocation response');
      }

      if (!results.length) {
        throw new Error('wrong address');
      }

      const { lat, lng } = results[0].geometry.location;

      return { latitude: lat, longitude: lng };
    },
  });
