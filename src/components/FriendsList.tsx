import type { Friend, QueryOptions } from '@brewskey/js-api';

import * as React from 'react';
import { useMemo } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import List from '../common/List';
import ListEmpty from '../common/ListEmpty';
import UserAvatar from '../common/avatars/UserAvatar';
import ListItem from '../common/ListItem';
import LoadingListFooter from '../common/LoadingListFooter';
import { useGetFriends } from '../hooks/queries/FriendQueries';

type Props = {
  ListHeaderComponent?:
     
    | React.ComponentType<any>
    | React.ReactNode
    | null
    | undefined;
  queryOptions?: QueryOptions;
};

const LoadedRow = ({
  item: friend,
  onItemPress,
}: {
  item: Friend;
  onItemPress: (friend: Friend) => void;
}): React.ReactElement => (
  <ListItem
    leftAvatar={<UserAvatar userName={friend.friendAccount.userName} />}
    chevron={false}
    item={friend}
    onPress={onItemPress}
    title={friend.friendAccount.userName}
  />
);

const FriendsList: React.FC<Props> = ({
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

export default FriendsList;
