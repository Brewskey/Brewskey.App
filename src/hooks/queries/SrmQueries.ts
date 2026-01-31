import { SrmDAO } from '@brewskey/js-api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import nullthrows from 'nullthrows';

import { getStringFromEntityID } from 'utils/getStringFromEntityID';

import type { EntityID, QueryOptions, Srm } from '@brewskey/js-api';
import type {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
} from '@tanstack/react-query';

enum SrmQueryKeys {
  SrmById = 'srm_by_id',
  Srms = 'srms',
}

export const useGetSrmById = (
  id: EntityID | undefined | null,
): UseQueryResult<Srm> =>
  useQuery({
    queryKey: [SrmQueryKeys.SrmById, getStringFromEntityID(id)],
    queryFn: async () => SrmDAO.fetchByID(nullthrows(id)),
    enabled: id != null,
  });

export const useGetSrms = (
  queryOptions?: Omit<QueryOptions, 'skip'>,
): UseInfiniteQueryResult<InfiniteData<Srm[]>> =>
  useInfiniteQuery({
    queryKey: [SrmQueryKeys.Srms, queryOptions],
    queryFn: async ({ pageParam = 0 }) =>
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
