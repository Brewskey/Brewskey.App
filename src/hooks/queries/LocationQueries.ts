import { LocationDAO } from '@brewskey/js-api';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import nullthrows from 'nullthrows';

import { getStringFromEntityID } from '../../utils/getStringFromEntityID';

import type {
  Coordinates,
  EntityID,
  Location,
  LocationMutator,
  QueryOptions,
} from '@brewskey/js-api';
import type {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
} from '@tanstack/react-query';

export enum LocationQueryKeys {
  LocationById = 'location_by_id',
  Locations = 'locations',
  NearbyLocations = 'nearby_locations',
  LocationsCount = 'locations_count',
}

export const NEARBY_LOCATIONS_QUERY_KEY_BASE = 'GET_COORDINATES_FROM_ADDRESS';

export const useGetLocationById = (
  id: EntityID | undefined | null,
): UseQueryResult<Location> =>
  useQuery({
    queryKey: [LocationQueryKeys.LocationById, getStringFromEntityID(id)],
    queryFn: async () => LocationDAO.fetchByID(nullthrows(id)),
    enabled: id != null,
  });

export const useGetLocations = (
  queryOptions?: Omit<QueryOptions, 'skip'>,
): UseInfiniteQueryResult<InfiniteData<Location[]>> =>
  useInfiniteQuery({
    queryKey: [LocationQueryKeys.Locations, queryOptions],
    queryFn: async ({ pageParam = 0 }) =>
      LocationDAO.fetchMany({
        ...queryOptions,
        orderBy: queryOptions?.orderBy ?? [
          {
            column: 'id',
            direction: 'desc',
          },
        ],
        skip: pageParam * 20,
        take: 20,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 20 ? pages.length : undefined,
    getPreviousPageParam: (_, pages) => pages.length,
  });

export const useGetLocationsCount = (queryOptions?: QueryOptions) =>
  useQuery({
    queryKey: [LocationQueryKeys.LocationsCount, queryOptions],
    queryFn: async () => LocationDAO.count(queryOptions),
  });

export const useGetNearbyLocations = (
  parameters: Coordinates & { radius?: number },
  {
    enabled,
  }: {
    enabled: boolean;
  },
) =>
  useQuery({
    queryKey: [NEARBY_LOCATIONS_QUERY_KEY_BASE, parameters],
    queryFn: async () =>
      LocationDAO.getNearbyLocations({
        radius: 15_000,
        ...parameters,
      }),
    enabled,
  });

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (locationId: EntityID) =>
      LocationDAO.deleteByID(locationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [LocationQueryKeys.Locations],
      });
      queryClient.invalidateQueries({
        queryKey: [LocationQueryKeys.LocationById],
      });
    },
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mutator: LocationMutator) => {
      const location = await LocationDAO.post(mutator);
      return location;
    },
    onSuccess: (location) => {
      queryClient.setQueryData(
        [LocationQueryKeys.LocationById, getStringFromEntityID(location.id)],
        location,
      );
      queryClient.invalidateQueries({
        queryKey: [LocationQueryKeys.Locations],
      });
    },
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      locationId,
      mutator,
    }: {
      locationId: EntityID;
      mutator: LocationMutator;
    }) => {
      await LocationDAO.put(locationId, mutator);
      return LocationDAO.fetchByID(locationId);
    },
    onSuccess: (location) => {
      queryClient.setQueryData(
        [LocationQueryKeys.LocationById, getStringFromEntityID(location.id)],
        location,
      );
      queryClient.invalidateQueries({
        queryKey: [LocationQueryKeys.Locations],
      });
    },
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
