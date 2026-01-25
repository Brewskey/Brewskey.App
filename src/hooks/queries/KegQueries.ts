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
import { TapQueryKeys } from './TapQueries';
import { NEARBY_LOCATIONS_QUERY_KEY_BASE } from './LocationQueries';

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
    refetchOnWindowFocus: false,
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mutator) => KegDAO.post(mutator),
    onSuccess: async () => {
      // Invalidate all keg queries - this will match all queries that start with these keys
      // Using refetchType: 'active' ensures active queries refetch immediately
      await queryClient.invalidateQueries({
        queryKey: [KegQueryKeys.KeyById],
        refetchType: 'active',
      });
      await queryClient.invalidateQueries({
        queryKey: [KegQueryKeys.KeyByQuery],
        refetchType: 'active',
      });
      await queryClient.invalidateQueries({
        queryKey: [KegQueryKeys.KegsList],
        refetchType: 'active',
      });
      // Clear cache for tap values since taps include keg information
      await queryClient.invalidateQueries({
        queryKey: [TapQueryKeys.TapById],
        refetchType: 'active',
      });
      await queryClient.invalidateQueries({
        queryKey: [TapQueryKeys.Taps],
        refetchType: 'active',
      });
      // Clear cache for nearby locations since they display keg information
      await queryClient.invalidateQueries({
        queryKey: [NEARBY_LOCATIONS_QUERY_KEY_BASE],
        refetchType: 'active',
      });
    },
  });
};

export const useUpdateKeg = (): UseMutationResult<Keg, Error, KegMutator> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mutator) =>
      KegDAO.put(nullthrows(mutator.id, 'keg ID was not defined'), mutator),
    onSuccess: async (keg) => {
      // Invalidate all keg queries - this will match all queries that start with these keys
      // Using refetchType: 'active' ensures active queries refetch immediately
      await queryClient.invalidateQueries({
        queryKey: [KegQueryKeys.KeyById],
        refetchType: 'active',
      });
      await queryClient.invalidateQueries({
        queryKey: [KegQueryKeys.KeyByQuery],
        refetchType: 'active',
      });
      await queryClient.invalidateQueries({
        queryKey: [KegQueryKeys.KegsList],
        refetchType: 'active',
      });
      // Clear cache for tap values since taps include keg information
      await queryClient.invalidateQueries({
        queryKey: [TapQueryKeys.TapById],
        refetchType: 'active',
      });
      await queryClient.invalidateQueries({
        queryKey: [TapQueryKeys.Taps],
        refetchType: 'active',
      });
      // Clear cache for nearby locations since they display keg information
      await queryClient.invalidateQueries({
        queryKey: [NEARBY_LOCATIONS_QUERY_KEY_BASE],
        refetchType: 'active',
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
    onSuccess: async () => {
      // Invalidate all keg queries - this will match all queries that start with these keys
      // Using refetchType: 'active' ensures active queries refetch immediately
      await queryClient.invalidateQueries({
        queryKey: [KegQueryKeys.KeyById],
        refetchType: 'active',
      });
      await queryClient.invalidateQueries({
        queryKey: [KegQueryKeys.KeyByQuery],
        refetchType: 'active',
      });
      await queryClient.invalidateQueries({
        queryKey: [KegQueryKeys.KegsList],
        refetchType: 'active',
      });
      // Clear cache for tap values since taps include keg information
      await queryClient.invalidateQueries({
        queryKey: [TapQueryKeys.TapById],
        refetchType: 'active',
      });
      await queryClient.invalidateQueries({
        queryKey: [TapQueryKeys.Taps],
        refetchType: 'active',
      });
      // Clear cache for nearby locations since they display keg information
      await queryClient.invalidateQueries({
        queryKey: [NEARBY_LOCATIONS_QUERY_KEY_BASE],
        refetchType: 'active',
      });
    },
  });
};
