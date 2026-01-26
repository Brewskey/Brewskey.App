import { AvailabilityDAO } from '@brewskey/js-api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import nullthrows from 'nullthrows';

import { getStringFromEntityID } from '../../utils/getStringFromEntityID';

import type { Availability, EntityID, QueryOptions } from '@brewskey/js-api';
import type {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
} from '@tanstack/react-query';

enum AvailabilityQueryKeys {
  AvailabilityById = 'availability_by_id',
  Availabilities = 'availabilities',
}

export const useGetAvailabilityById = (
  id: EntityID | undefined | null,
): UseQueryResult<Availability> =>
  useQuery({
    queryKey: [
      AvailabilityQueryKeys.AvailabilityById,
      getStringFromEntityID(id),
    ],
    queryFn: async () => AvailabilityDAO.fetchByID(nullthrows(id)),
    enabled: id != null,
  });

export const useGetAvailabilities = (
  queryOptions?: Omit<QueryOptions, 'skip'>,
): UseInfiniteQueryResult<InfiniteData<Availability[]>> =>
  useInfiniteQuery({
    queryKey: [AvailabilityQueryKeys.Availabilities, queryOptions],
    queryFn: async ({ pageParam = 0 }) =>
      AvailabilityDAO.fetchMany({
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
