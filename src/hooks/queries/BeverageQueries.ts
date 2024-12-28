import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseMutationResult,
  UseQueryResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import {
  Beverage,
  BeverageDAO,
  EntityID,
  QueryOptions,
} from '@brewskey/js-api';

enum BeverageQueryKeys {
  BeveragesById = 'beverage_get_by_id',
  BeveragesByUserId = 'beverage_for_user_id',
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
    queryKey: [BeverageQueryKeys.BeveragesByUserId, queryOptions],
    queryFn: () => BeverageDAO.fetchMany(queryOptions),
    initialPageParam: 0,
    getNextPageParam: (_, pages) => pages.length + 1,
    getPreviousPageParam: (_, pages) => pages.length,
  });

export const useDeleteBeverageById = (): UseMutationResult<
  Beverage,
  Error,
  EntityID
> =>
  useMutation({
    mutationFn: (beverageId) => BeverageDAO.deleteByID(beverageId),
  });
