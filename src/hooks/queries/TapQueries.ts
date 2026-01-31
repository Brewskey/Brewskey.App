import { TapDAO } from '@brewskey/js-api';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import nullthrows from 'nullthrows';

import { getStringFromEntityID } from 'utils/getStringFromEntityID';

import type {
  EntityID,
  LeaderboardItem,
  QueryOptions,
  Tap,
  TapMutator,
} from '@brewskey/js-api';
import type {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
} from '@tanstack/react-query';

import type { LeaderboardDurationValue } from 'components/LeaderboardDurationPicker';

export enum TapQueryKeys {
  TapById = 'tap_by_id',
  Taps = 'taps',
  LeaderboardQuery = 'leaderboard_query',
}

export const useGetTapById = (id: EntityID): UseQueryResult<Tap> =>
  useQuery({
    queryKey: [TapQueryKeys.TapById, getStringFromEntityID(id)],
    queryFn: async () => TapDAO.fetchByID(id),
  });

export const useGetTaps = (
  queryOptions?: Omit<QueryOptions, 'skip'>,
): UseInfiniteQueryResult<InfiniteData<Tap[]>> =>
  useInfiniteQuery({
    queryKey: [TapQueryKeys.Taps, queryOptions],
    queryFn: async ({ pageParam = 0 }) =>
      TapDAO.fetchMany({
        ...queryOptions,
        skip: pageParam * 20,
        take: 20,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      // If the last page returned fewer items than requested (20), we've reached the end
      if (lastPage.length < 20) {
        return undefined;
      }
      return pages.length;
    },
    getPreviousPageParam: (_, pages) => pages.length,
  });

export const useCreateTap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mutator: TapMutator) => TapDAO.post(mutator),
    onSuccess: async () => {
      await queryClient.removeQueries({
        queryKey: [TapQueryKeys.Taps],
      });
    },
  });
};
export const useUpdateTap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mutator: TapMutator) =>
      TapDAO.put(nullthrows(mutator.id), mutator),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: [TapQueryKeys.Taps],
      });
      await queryClient.invalidateQueries({
        queryKey: [TapQueryKeys.TapById, getStringFromEntityID(result.id)],
      });
    },
  });
};

export const useDeleteTap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tapId: EntityID) => TapDAO.deleteByID(tapId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [TapQueryKeys.Taps],
      });
    },
  });
};

export const useGetTapLeaderboard = (
  tapId: EntityID,
  duration: LeaderboardDurationValue,
  queryOptions?: QueryOptions,
): UseInfiniteQueryResult<InfiniteData<LeaderboardItem[]>> =>
  useInfiniteQuery({
    queryKey: [
      TapQueryKeys.LeaderboardQuery,
      getStringFromEntityID(tapId),
      duration,
      queryOptions,
    ],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) =>
      TapDAO.fetchLeaderboard(tapId, duration, {
        ...queryOptions,
        skip: pageParam * 20,
        take: 20,
      }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 20 ? pages.length : undefined,
    getPreviousPageParam: (_, pages) => pages.length,
  });
