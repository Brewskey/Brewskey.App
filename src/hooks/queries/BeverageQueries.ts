import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseMutationResult,
  UseQueryResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Beverage,
  BeverageDAO,
  BeverageMutator,
  EntityID,
  QueryOptions,
} from '@brewskey/js-api';
import nullthrows from 'nullthrows';

enum BeverageQueryKeys {
  BeveragesById = 'beverage_get_by_id',
  BeveragesByUserId = 'beverage_for_user_id',
  Beverages = 'beverages',
}

export const useGetBeverageById = (
  beverageId: EntityID | undefined | null,
): UseQueryResult<Beverage, Error> =>
  useQuery({
    queryKey: [BeverageQueryKeys.BeveragesById, beverageId],
    queryFn: () => BeverageDAO.fetchByID(beverageId!),
    enabled: beverageId != null,
  });

export const useGetBeverages = (
  queryOptions?: Omit<QueryOptions, 'skip'>,
): UseInfiniteQueryResult<InfiniteData<Beverage[]>, Error> =>
  useInfiniteQuery({
    queryKey: [BeverageQueryKeys.Beverages, queryOptions],
    queryFn: ({ pageParam = 0 }) =>
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
        [BeverageQueryKeys.BeveragesById, beverage.id],
        beverage,
      );
      queryClient.invalidateQueries({ queryKey: [BeverageQueryKeys.Beverages] });
    },
  });
};

export const useUpdateBeverage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mutator: BeverageMutator) => {
      const beverageId = nullthrows(mutator.id);
      await BeverageDAO.put(beverageId, mutator);
      return await BeverageDAO.fetchByID(beverageId);
    },
    onSuccess: (beverage) => {
      queryClient.setQueryData(
        [BeverageQueryKeys.BeveragesById, beverage.id],
        beverage,
      );
      queryClient.invalidateQueries({ queryKey: [BeverageQueryKeys.Beverages] });
    },
  });
};

export const useDeleteBeverageById = (): UseMutationResult<
  Beverage,
  Error,
  EntityID
> =>
  useMutation({
    mutationFn: (beverageId) => BeverageDAO.deleteByID(beverageId),
  });
