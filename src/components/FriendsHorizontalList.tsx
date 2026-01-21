import type { Friend, QueryOptions } from '@brewskey/js-api';

import * as React from 'react';
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import List from '../common/List';
import ListEmpty from '../common/ListEmpty';
import UserAvatar from '../common/avatars/UserAvatar';
import LoadingListFooter from '../common/LoadingListFooter';
import BaseAvatar from '../common/avatars/BaseAvatar';
import { COLORS } from '../theme';
import { useGetFriends } from '../hooks/queries/FriendQueries';

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

type Props = {
  ListHeaderComponent?:
     
    | React.ComponentType<any>
    | React.ReactNode
    | null
    | undefined;
  queryOptions?: QueryOptions;
};

type LoadedRowProps = {
  item: Friend;
  onItemPress: (friend: Friend) => void;
};

const LoadedRow: React.FC<LoadedRowProps> = ({ item: friend, onItemPress }) => {
  const handlePress = () => {
    onItemPress(friend);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.friendContainer} testID={`friend-item-${friend.friendAccount.id}`}>
      <UserAvatar size={100} rounded={true} userName={friend.friendAccount.userName} />
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
    router.navigate(`/(tabs)/profile/${friend.friendAccount.id}`);
  };

  const onRefreshList = async () => {
    await refetch();
  };

  const keyExtractor = (item: Friend): string => item.id.toString();

  const renderRow = ({ item: friend }: { item: Friend }): React.ReactElement => (
    <LoadedRow item={friend} onItemPress={onItemPress} />
  );

  return (
    <List
      data={friendsData}
      horizontal
      keyExtractor={keyExtractor}
      listType="flatList"
      ListEmptyComponent={!isLoading ? <ListEmpty message="No friends" /> : null}
      ListFooterComponent={<LoadingListFooter isLoading={isFetchingNextPage} />}
      ListHeaderComponent={ListHeaderComponent as React.ComponentType | React.ReactElement | null | undefined}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      onRefresh={onRefreshList}
      renderItem={renderRow}
      testID="friends-horizontal-list"
    />
  );
};

const LoadingRow = () => (
  <View style={styles.friendContainer}>
    <BaseAvatar size={100} rounded={true} uri="" />
    <View style={styles.userNameLoadingPlaceholder} />
  </View>
);

export default FriendsHorizontalList;
