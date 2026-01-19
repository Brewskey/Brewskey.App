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
  Style,
  StyleDAO,
} from '@brewskey/js-api';
import nullthrows from 'nullthrows';

enum StyleQueryKeys {
  StyleById = 'style_by_id',
  Styles = 'styles',
}

export const useGetStyleById = (
  id: EntityID | undefined | null,
): UseQueryResult<Style, Error> =>
  useQuery({
    queryKey: [StyleQueryKeys.StyleById, id],
    queryFn: () => StyleDAO.fetchByID(nullthrows(id)),
    enabled: id != null,
  });

export const useGetStyles = (
  queryOptions?: Omit<QueryOptions, 'skip'>,
): UseInfiniteQueryResult<InfiniteData<Style[]>, Error> =>
  useInfiniteQuery({
    queryKey: [StyleQueryKeys.Styles, queryOptions],
    queryFn: ({ pageParam = 0 }) =>
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
