import * as React from 'react';
import { useMemo } from 'react';

import { useRouter } from 'expo-router';

import UserAvatar from '../common/avatars/UserAvatar';
import List from '../common/List';
import ListEmpty from '../common/ListEmpty';
import ListItem from '../common/ListItem';
import LoadingListFooter from '../common/LoadingListFooter';
import { useGetFriends } from '../hooks/queries/FriendQueries';

import type { Friend, QueryOptions } from '@brewskey/js-api';

interface Props {
  ListHeaderComponent?:
    | React.ComponentType<any>
    | React.ReactNode
    | null
    | undefined;
  queryOptions?: QueryOptions;
}

const LoadedRow = ({
  item: friend,
  onItemPress,
}: {
  item: Friend;
  onItemPress: (friend: Friend) => void;
}): React.ReactElement => (
  <ListItem
    chevron={false}
    item={friend}
    leftAvatar={<UserAvatar userName={friend.friendAccount.userName} />}
    onPress={onItemPress}
    testID={`friend-item-${friend.friendAccount.id}`}
    title={friend.friendAccount.userName}
  />
);

const FriendsList: React.FC<Props> = ({
  ListHeaderComponent,
  queryOptions = {},
}) => {
  const router = useRouter();

  const {
    data: friendsData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetFriends(queryOptions);

  const onItemPress = (friend: Friend) => {
    router.navigate({
      pathname: '/(tabs)/profile/[id]',
      params: { id: String(friend.friendAccount.id) },
    });
  };

  const onRefreshList = async () => {
    await refetch();
  };

  const keyExtractor = (item: Friend): string => item.id.toString();

  const renderRow = ({
    item: friend,
  }: {
    item: Friend;
  }): React.ReactElement => (
    <LoadedRow item={friend} onItemPress={onItemPress} />
  );

  return (
    <List
      data={friendsData}
      keyExtractor={keyExtractor}
      ListFooterComponent={<LoadingListFooter isLoading={isFetchingNextPage} />}
      listType="flatList"
      onRefresh={onRefreshList}
      renderItem={renderRow}
      testID="friends-list"
      ListEmptyComponent={
        !isLoading ? <ListEmpty message="No friends" /> : null
      }
      ListHeaderComponent={
        ListHeaderComponent as
          | React.ComponentType
          | React.ReactElement
          | null
          | undefined
      }
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
    />
  );
};

export default FriendsList;
