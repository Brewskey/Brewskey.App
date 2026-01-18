import type { Friend, QueryOptions } from '@brewskey/js-api';

import * as React from 'react';
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

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
    <TouchableOpacity onPress={handlePress} style={styles.friendContainer}>
      <UserAvatar size={100} rounded={true} userName={friend.friendAccount.userName} />
      <Text style={styles.userNameText}>{friend.friendAccount.userName}</Text>
    </TouchableOpacity>
  );
};

const FriendsHorizontalList: React.FC<Props> = ({
  ListHeaderComponent,
  queryOptions = {},
}) => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();

  const {
    data: friendsData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetFriends(queryOptions);

  const onItemPress = (friend: Friend) => {
    navigation.navigate('LoggedInStack', {
      screen: 'home',
      params: {
        screen: 'profile',
        params: {
          id: friend.friendAccount.id,
        },
      },
    });
  };

  const onRefreshList = () => {
    refetch();
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
