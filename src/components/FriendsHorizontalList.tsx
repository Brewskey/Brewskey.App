import * as React from 'react';

import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { UserAvatar } from 'common/avatars/UserAvatar';
import { List } from 'common/List';
import { ListEmpty } from 'common/ListEmpty';
import { LoadingListFooter } from 'common/LoadingListFooter';
import { useGetFriends } from 'hooks/queries/FriendQueries';
import { COLORS } from 'theme';

import type { Friend, QueryOptions } from '@brewskey/js-api';

const styles = StyleSheet.create({
  friendContainer: {
    alignItems: 'center',
    padding: 12,
  },
  userNameLoadingPlaceholder: {
    backgroundColor: COLORS.secondary2,
    height: 6,
    marginTop: 4,
    width: 60,
  },
  userNameText: {
    color: COLORS.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

interface Props {
  ListHeaderComponent?:
    | React.ComponentType<any>
    | React.ReactNode
    | null
    | undefined;
  queryOptions?: QueryOptions;
}

interface LoadedRowProps {
  item: Friend;
  onItemPress: (friend: Friend) => void;
}

const LoadedRow: React.FC<LoadedRowProps> = ({ item: friend, onItemPress }) => {
  const handlePress = () => {
    onItemPress(friend);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.friendContainer}
      testID={`friend-item-${friend.friendAccount.id}`}
    >
      <UserAvatar rounded size={100} userName={friend.friendAccount.userName} />
      <Text style={styles.userNameText}>{friend.friendAccount.userName}</Text>
    </TouchableOpacity>
  );
};

const FriendsHorizontalList: React.FC<Props> = ({
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
      pathname: '/profile/[id]',
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
      horizontal
      data={friendsData}
      keyExtractor={keyExtractor}
      ListFooterComponent={<LoadingListFooter isLoading={isFetchingNextPage} />}
      listType="flatList"
      onRefresh={onRefreshList}
      renderItem={renderRow}
      testID="friends-horizontal-list"
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

export { FriendsHorizontalList };
