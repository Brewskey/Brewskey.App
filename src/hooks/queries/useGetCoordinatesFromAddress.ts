import { fetchJSON } from '../../utils';
import { useQuery } from '@tanstack/react-query';
import nullthrows from 'nullthrows';

// todo move to secure please when it will be real key
const API_KEY = 'AIzaSyD_ZzDpXh6LAuoK7XaSecZqhnF0si6Eak0';

const QUERY_KEY_BASE = 'GET_COORDINATES_FROM_ADDRESS';

type ApiResult = {
  status: string;
  results: { geometry: { location: { lat: number; lng: number } } }[];
};

export const useGetCoordinatesFromAddress = (address: string | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEY_BASE, address],
    queryFn: () => {
      const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
      url.searchParams.set('key', API_KEY);
      url.searchParams.set('address', nullthrows(address));
      return fetchJSON(url.toString()) as Promise<ApiResult>;
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
};
