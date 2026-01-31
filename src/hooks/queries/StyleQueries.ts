import { StyleDAO } from '@brewskey/js-api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import nullthrows from 'nullthrows';

import { getStringFromEntityID } from 'utils/getStringFromEntityID';

import type { EntityID, QueryOptions, Style } from '@brewskey/js-api';
import type {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
} from '@tanstack/react-query';

enum StyleQueryKeys {
  StyleById = 'style_by_id',
  Styles = 'styles',
}

export const useGetStyleById = (
  id: EntityID | undefined | null,
): UseQueryResult<Style> =>
  useQuery({
    queryKey: [StyleQueryKeys.StyleById, getStringFromEntityID(id)],
    queryFn: async () => StyleDAO.fetchByID(nullthrows(id)),
    enabled: id != null,
  });

export const useGetStyles = (
  queryOptions?: Omit<QueryOptions, 'skip'>,
): UseInfiniteQueryResult<InfiniteData<Style[]>> =>
  useInfiniteQuery({
    queryKey: [StyleQueryKeys.Styles, queryOptions],
    queryFn: async ({ pageParam = 0 }) =>
      StyleDAO.fetchMany({
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
