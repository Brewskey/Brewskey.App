import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Friend, FriendDAO, QueryOptions, EntityID } from '@brewskey/js-api';
import nullthrows from 'nullthrows';

type FriendMutator = Omit<Partial<Friend>, 'createdDate'> & { 
  id: EntityID;
  createdDate?: Date;
};

export enum FriendKeys {
  GetMany = 'friends_get_many',
  GetCount = 'friends_get_count',
  GetSingle = 'friend_get_single',
}

export const useGetManyFriends = (
  queryOptions?: QueryOptions,
  options?: { isEnabled: boolean },
): UseQueryResult<Friend[], Error> =>
  useQuery({
    queryKey: [FriendKeys.GetMany, queryOptions],
    queryFn: () => FriendDAO.fetchMany(queryOptions),
    enabled: options?.isEnabled,
  });

export const useGetFriends = (
  queryOptions?: Omit<QueryOptions, 'skip'>,
): UseInfiniteQueryResult<InfiniteData<Friend[]>, Error> =>
  useInfiniteQuery({
    queryKey: [FriendKeys.GetMany, queryOptions],
    queryFn: ({ pageParam = 0 }) =>
      FriendDAO.fetchMany({
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

export const useGetFriendsCount = (
  queryOptions?: QueryOptions,
  options?: { isEnabled: boolean },
): UseQueryResult<number, Error> =>
  useQuery({
    queryKey: [FriendKeys.GetCount, queryOptions],
    queryFn: () => FriendDAO.count(queryOptions),
    enabled: options?.isEnabled,
  });

export const useGetFriendSingle = (
  queryOptions?: QueryOptions,
): UseQueryResult<Friend | null, Error> =>
  useQuery({
    queryKey: [FriendKeys.GetSingle, queryOptions],
    queryFn: async () => {
      const result = await FriendDAO.fetchSingle(queryOptions);
      return result ?? null;
    },
  });

export const useUpdateFriend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mutator: FriendMutator) => {
      const friendId = nullthrows(mutator.id);
      const { createdDate, ...mutatorWithoutDate } = mutator;
      await FriendDAO.put(friendId, mutatorWithoutDate as Friend);
      return await FriendDAO.fetchByID(friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FriendKeys.GetMany] });
      queryClient.invalidateQueries({ queryKey: [FriendKeys.GetSingle] });
    },
  });
};

export const useDeleteFriend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (friendId: EntityID) => FriendDAO.deleteByID(friendId as number),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FriendKeys.GetMany] });
      queryClient.invalidateQueries({ queryKey: [FriendKeys.GetSingle] });
    },
  });
};

export const useAddFriend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userName: string) => FriendDAO.addFriend(userName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FriendKeys.GetMany] });
      queryClient.invalidateQueries({ queryKey: [FriendKeys.GetSingle] });
    },
  });
};
