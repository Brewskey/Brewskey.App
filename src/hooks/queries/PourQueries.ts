import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { EntityID, Pour, PourDAO, QueryOptions } from '@brewskey/js-api';

enum PourQueryKeys {
  PoursByBeverageIds = 'pours_by_beverage_ids',
  PoursList = 'pours_list',
  PourById = 'pour_get_by_id',
}

export const useGetPourById = (
  pourId: EntityID | undefined | null,
): UseQueryResult<Pour, Error> =>
  useQuery({
    queryKey: [PourQueryKeys.PourById, pourId],
    queryFn: () => PourDAO.fetchByID(pourId!),
    enabled: pourId != null,
  });

export const useGetPoursByBeverageIds = (
  beverageIds: EntityID[] | undefined,
  userId?: EntityID,
): UseQueryResult<Map<EntityID, number>, Error> =>
  useQuery({
    queryKey: [PourQueryKeys.PoursByBeverageIds, beverageIds],
    queryFn: () => PourDAO.getPoursByBeverageIDs(beverageIds!, userId),
    enabled: beverageIds != null,
  });

export const useGetPours = (
  queryOptions: QueryOptions,
): UseInfiniteQueryResult<InfiniteData<Pour[]>, Error> =>
  useInfiniteQuery({
    queryKey: [PourQueryKeys.PoursList, queryOptions],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      PourDAO.fetchMany({
        ...queryOptions,
        orderBy: [
          {
            column: 'id',
            direction: 'desc',
          },
        ],
        skip: pageParam * 20,
        take: 20,
      }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 20 ? pages.length : undefined,
    getPreviousPageParam: (_, pages) => pages.length,
  });

export const useDeletePour = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pourId: EntityID) => PourDAO.deleteByID(pourId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PourQueryKeys.PoursList] });
      queryClient.invalidateQueries({ queryKey: [PourQueryKeys.PoursByBeverageIds] });
    },
  });
};
