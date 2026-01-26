import { KegDAO, PourDAO } from '@brewskey/js-api';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import nullthrows from 'nullthrows';

import { NEARBY_LOCATIONS_QUERY_KEY_BASE } from './LocationQueries';
import { TapQueryKeys } from './TapQueries';
import { getStringFromEntityID } from '../../utils/getStringFromEntityID';

import type { EntityID, Keg, KegMutator, QueryOptions } from '@brewskey/js-api';
import type {
  InfiniteData,
  UseInfiniteQueryResult,
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query';

export enum KegQueryKeys {
  KeyById = 'keg_by_id',
  KeyByQuery = 'keg_by_query',
  KegsList = 'kegs_by_query',
}

export const useGetKegById = (
  id: EntityID | null | undefined,
): UseQueryResult<Keg> =>
  useQuery({
    queryKey: [KegQueryKeys.KeyById, getStringFromEntityID(id)],
    queryFn: async () => KegDAO.fetchByID(id),
    enabled: id != null,
  });

export const useGetKegByQuery = (
  queryOptions?: QueryOptions,
): UseQueryResult<Keg> =>
  useQuery({
    queryKey: [KegQueryKeys.KeyByQuery, queryOptions],
    queryFn: async () => KegDAO.fetchSingle(queryOptions),
    refetchOnWindowFocus: false,
  });

export const useGetKegs = (
  queryOptions: QueryOptions,
): UseInfiniteQueryResult<InfiniteData<Keg[]>> =>
  useInfiniteQuery({
    queryKey: [KegQueryKeys.KegsList, queryOptions],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) =>
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
    mutationFn: async (mutator) => KegDAO.post(mutator),
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
    mutationFn: async (mutator) =>
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
