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
  EntityID,
  Keg,
  KegDAO,
  KegMutator,
  PourDAO,
  QueryOptions,
} from '@brewskey/js-api';
import nullthrows from 'nullthrows';

export enum KegQueryKeys {
  KeyById = 'keg_by_id',
  KeyByQuery = 'keg_by_query',
  KegsList = 'kegs_by_query',
}

export const useGetKegById = (
  id: EntityID | null | undefined,
): UseQueryResult<Keg, Error> =>
  useQuery({
    queryKey: [KegQueryKeys.KeyById, id],
    queryFn: () => KegDAO.fetchByID(id!),
    enabled: id != null,
  });

export const useGetKegByQuery = (
  queryOptions?: QueryOptions | undefined,
): UseQueryResult<Keg, Error> =>
  useQuery({
    queryKey: [KegQueryKeys.KeyByQuery, queryOptions],
    queryFn: () => KegDAO.fetchSingle(queryOptions),
  });

export const useGetKegs = (
  queryOptions: QueryOptions,
): UseInfiniteQueryResult<InfiniteData<Keg[]>, Error> =>
  useInfiniteQuery({
    queryKey: [KegQueryKeys.KegsList, queryOptions],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      KegDAO.fetchMany({
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

export const useCreateKeg = (): UseMutationResult<Keg, Error, KegMutator> => {
  return useMutation({
    mutationFn: (mutator) => KegDAO.post(mutator),
    onSuccess: () => {},
  });
};

export const useUpdateKeg = (): UseMutationResult<Keg, Error, KegMutator> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mutator) =>
      KegDAO.put(nullthrows(mutator.id, 'keg ID was not defined'), mutator),
    onSuccess: async (keg) => {
      await queryClient.invalidateQueries({
        queryKey: [KegQueryKeys.KeyById, keg.id],
      });
      await queryClient.invalidateQueries({
        queryKey: [KegQueryKeys.KeyByQuery],
      });
    },
  });
};

export const useFloatKeg = (): UseMutationResult<void, Error, KegMutator> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mutator) => {
      await KegDAO.floatKeg(
        nullthrows(mutator.tapId, 'tap ID was not defined'),
      );
    },
    onSuccess: async (_, keg) => {
      await queryClient.invalidateQueries({
        queryKey: [KegQueryKeys.KeyById, keg.id],
      });
      await queryClient.invalidateQueries({
        queryKey: [KegQueryKeys.KeyByQuery],
      });
    },
  });
};
