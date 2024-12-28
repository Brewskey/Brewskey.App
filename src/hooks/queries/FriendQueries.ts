import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import { Friend, FriendDAO, QueryOptions } from '@brewskey/js-api';

enum FriendKeys {
  GetMany = 'friends_get_many',
  GetCount = 'friends_get_count',
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

export const useGetFriendsCount = (
  queryOptions?: QueryOptions,
  options?: { isEnabled: boolean },
): UseQueryResult<number, Error> =>
  useQuery({
    queryKey: [FriendKeys.GetCount, queryOptions],
    queryFn: () => FriendDAO.count(queryOptions),
    enabled: options?.isEnabled,
  });
