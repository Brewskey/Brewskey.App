import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import {
  EntityID,
  QueryOptions,
  Srm,
  SrmDAO,
} from '@brewskey/js-api';
import nullthrows from 'nullthrows';

enum SrmQueryKeys {
  SrmById = 'srm_by_id',
  Srms = 'srms',
}

export const useGetSrmById = (
  id: EntityID | undefined | null,
): UseQueryResult<Srm, Error> =>
  useQuery({
    queryKey: [SrmQueryKeys.SrmById, id],
    queryFn: () => SrmDAO.fetchByID(nullthrows(id)),
    enabled: id != null,
  });

export const useGetSrms = (
  queryOptions?: Omit<QueryOptions, 'skip'>,
): UseInfiniteQueryResult<InfiniteData<Srm[]>, Error> =>
  useInfiniteQuery({
    queryKey: [SrmQueryKeys.Srms, queryOptions],
    queryFn: ({ pageParam = 0 }) =>
      SrmDAO.fetchMany({
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
