import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import {
  Availability,
  AvailabilityDAO,
  EntityID,
  QueryOptions,
} from '@brewskey/js-api';
import nullthrows from 'nullthrows';

enum AvailabilityQueryKeys {
  AvailabilityById = 'availability_by_id',
  Availabilities = 'availabilities',
}

export const useGetAvailabilityById = (
  id: EntityID | undefined | null,
): UseQueryResult<Availability, Error> =>
  useQuery({
    queryKey: [AvailabilityQueryKeys.AvailabilityById, id],
    queryFn: () => AvailabilityDAO.fetchByID(nullthrows(id)),
    enabled: id != null,
  });

export const useGetAvailabilities = (
  queryOptions?: Omit<QueryOptions, 'skip'>,
): UseInfiniteQueryResult<InfiniteData<Availability[]>, Error> =>
  useInfiniteQuery({
    queryKey: [AvailabilityQueryKeys.Availabilities, queryOptions],
    queryFn: ({ pageParam = 0 }) =>
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
