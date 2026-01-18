import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  EntityID,
  LeaderboardItem,
  QueryOptions,
  Tap,
  TapDAO,
  TapMutator,
} from '@brewskey/js-api';
import { LeaderboardDurationValue } from '../../components/LeaderboardDurationPicker';
import nullthrows from 'nullthrows';

enum TapQueryKeys {
  TapById = 'tap_by_id',
  Taps = 'taps',
  LeaderboardQuery = 'leaderboard_query',
}

export const useGetTapById = (id: EntityID): UseQueryResult<Tap, Error> =>
  useQuery({
    queryKey: [TapQueryKeys.TapById, id],
    queryFn: () => TapDAO.fetchByID(id),
  });

export const useGetTaps = (
  queryOptions?: Omit<QueryOptions, 'skip'>,
): UseInfiniteQueryResult<InfiniteData<Tap[]>, Error> =>
  useInfiniteQuery({
    queryKey: [TapQueryKeys.Taps, queryOptions],
    queryFn: ({ pageParam = 0 }) =>
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
    mutationFn: (mutator: TapMutator) => TapDAO.post(mutator),
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
    mutationFn: (mutator: TapMutator) =>
      TapDAO.put(nullthrows(mutator.id), mutator),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: [TapQueryKeys.Taps],
      });
      await queryClient.invalidateQueries({
        queryKey: [TapQueryKeys.TapById, result.id],
      });
    },
  });
};

export const useDeleteTap = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tapId: EntityID) => TapDAO.deleteByID(tapId),
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
): UseInfiniteQueryResult<InfiniteData<LeaderboardItem[]>, Error> =>
  useInfiniteQuery({
    queryKey: [TapQueryKeys.LeaderboardQuery, tapId, duration, queryOptions],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      TapDAO.fetchLeaderboard(tapId, duration, {
        ...queryOptions,
        skip: pageParam * 20,
        take: 20,
      }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 20 ? pages.length : undefined,
    getPreviousPageParam: (_, pages) => pages.length,
  });
