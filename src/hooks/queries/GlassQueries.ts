import { GlassDAO } from '@brewskey/js-api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import nullthrows from 'nullthrows';

import { getStringFromEntityID } from '../../utils/getStringFromEntityID';

import type { EntityID, Glass, QueryOptions } from '@brewskey/js-api';
import type {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
} from '@tanstack/react-query';

enum GlassQueryKeys {
  GlassById = 'glass_by_id',
  Glasses = 'glasses',
}

export const useGetGlassById = (
  id: EntityID | undefined | null,
): UseQueryResult<Glass> =>
  useQuery({
    queryKey: [GlassQueryKeys.GlassById, getStringFromEntityID(id)],
    queryFn: async () => GlassDAO.fetchByID(nullthrows(id)),
    enabled: id != null,
  });

export const useGetGlasses = (
  queryOptions?: Omit<QueryOptions, 'skip'>,
): UseInfiniteQueryResult<InfiniteData<Glass[]>> =>
  useInfiniteQuery({
    queryKey: [GlassQueryKeys.Glasses, queryOptions],
    queryFn: async ({ pageParam = 0 }) =>
      GlassDAO.fetchMany({
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
