import { BeverageDAO } from '@brewskey/js-api';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import nullthrows from 'nullthrows';

import { getStringFromEntityID } from 'utils/getStringFromEntityID';

import type {
  Beverage,
  BeverageMutator,
  EntityID,
  QueryOptions,
} from '@brewskey/js-api';
import type {
  InfiniteData,
  UseInfiniteQueryResult,
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query';

enum BeverageQueryKeys {
  BeveragesById = 'beverage_get_by_id',
  BeveragesByUserId = 'beverage_for_user_id',
  Beverages = 'beverages',
}

export const useGetBeverageById = (
  beverageId: EntityID | undefined | null,
): UseQueryResult<Beverage> =>
  useQuery({
    queryKey: [
      BeverageQueryKeys.BeveragesById,
      getStringFromEntityID(beverageId),
    ],
    queryFn: async () => {
      if (beverageId == null) throw new Error('beverageId required');
      return BeverageDAO.fetchByID(beverageId);
    },
    enabled: beverageId != null,
  });

export const useGetBeverages = (
  queryOptions?: Omit<QueryOptions, 'skip'>,
): UseInfiniteQueryResult<InfiniteData<Beverage[]>> =>
  useInfiniteQuery({
    queryKey: [BeverageQueryKeys.Beverages, queryOptions],
    queryFn: async ({ pageParam = 0 }) =>
      BeverageDAO.fetchMany({
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

export const useCreateBeverage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mutator: BeverageMutator) => {
      const beverage = await BeverageDAO.post(mutator);
      return beverage;
    },
    onSuccess: (beverage) => {
      queryClient.setQueryData(
        [BeverageQueryKeys.BeveragesById, getStringFromEntityID(beverage.id)],
        beverage,
      );
      queryClient.invalidateQueries({
        queryKey: [BeverageQueryKeys.Beverages],
      });
    },
  });
};

export const useUpdateBeverage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mutator: BeverageMutator) => {
      const beverageId = nullthrows(mutator.id);
      await BeverageDAO.put(beverageId, mutator);
      return BeverageDAO.fetchByID(beverageId);
    },
    onSuccess: (beverage) => {
      queryClient.setQueryData(
        [BeverageQueryKeys.BeveragesById, getStringFromEntityID(beverage.id)],
        beverage,
      );
      queryClient.invalidateQueries({
        queryKey: [BeverageQueryKeys.Beverages],
      });
    },
  });
};

export const useDeleteBeverageById = (): UseMutationResult<
  Beverage,
  Error,
  EntityID
> =>
  useMutation({
    mutationFn: async (beverageId) => BeverageDAO.deleteByID(beverageId),
  });
