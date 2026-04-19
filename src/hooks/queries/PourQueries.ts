import { PourDAO } from '@brewskey/js-api';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { getStringFromEntityID } from 'utils/getStringFromEntityID';

import type { EntityID, Pour, QueryOptions } from '@brewskey/js-api';
import type {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
} from '@tanstack/react-query';

enum PourQueryKeys {
  PoursByBeverageIds = 'pours_by_beverage_ids',
  PoursList = 'pours_list',
  PourById = 'pour_get_by_id',
}

export const useGetPourById = (
  pourId: EntityID | undefined | null,
): UseQueryResult<Pour> =>
  useQuery({
    queryKey: [PourQueryKeys.PourById, getStringFromEntityID(pourId)],
    queryFn: async () => {
      if (pourId == null) {
        throw new Error('pourId required');
      }
      return PourDAO.fetchByID(pourId);
    },
    enabled: pourId != null,
  });

export const useGetPoursByBeverageIds = (
  beverageIds: EntityID[] | undefined,
  userId?: EntityID,
): UseQueryResult<Map<EntityID, number>> =>
  useQuery({
    queryKey: [
      PourQueryKeys.PoursByBeverageIds,
      beverageIds?.map((id) => getStringFromEntityID(id)),
    ],
    queryFn: async () => {
      if (beverageIds == null) {
        throw new Error('beverageIds required');
      }
      return PourDAO.getPoursByBeverageIDs(beverageIds, userId);
    },
    enabled: beverageIds != null,
  });

export const useGetPours = (
  queryOptions: QueryOptions,
): UseInfiniteQueryResult<InfiniteData<Pour[]>> =>
  useInfiniteQuery({
    queryKey: [PourQueryKeys.PoursList, queryOptions],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) =>
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
    mutationFn: async (pourId: EntityID) => PourDAO.deleteByID(pourId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PourQueryKeys.PoursList] });
      queryClient.invalidateQueries({
        queryKey: [PourQueryKeys.PoursByBeverageIds],
      });
    },
  });
};
