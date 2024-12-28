import type { Friend, QueryOptions } from '@brewskey/js-api';

import type { Row } from '../stores/DAOListStore';
import type { RowItemProps } from '../common/SwipeableRow';
import type { RenderItemProps } from 'react-native/Libraries/Lists/VirtualizedList';

import * as React from 'react';

import DAOListStore from '../stores/DAOListStore';
import { FriendStore } from '../stores/DAOStores';
import List from '../common/List';
import ListEmpty from '../common/ListEmpty';
import LoaderRow from '../common/LoaderRow';
import UserAvatar from '../common/avatars/UserAvatar';
import ListItem from '../common/ListItem';
import LoadingListFooter from '../common/LoadingListFooter';

type Props = {
  ListHeaderComponent?:
    | React.ComponentType<any>
    | React.ReactNode
    | null
    | undefined;
  queryOptions?: QueryOptions;
};

type InjectedProps = {
  navigation: Navigation;
};

@withNavigation
class FriendsList extends InjectedComponent<InjectedProps, Props> {
  static defaultProps: {
    queryOptions: QueryOptions;
  } = {
    queryOptions: {},
  };

  _listStore: DAOListStore<Friend> = new DAOListStore(FriendStore);

  componentDidMount() {
    this._listStore.initialize({
      ...this.props.queryOptions,
    });
  }

  _keyExtractor = (row: Row<Friend>): string => row.key;

  _onItemPress = (friend: Friend) =>
    this.injectedProps.navigation.navigate('profile', {
      id: friend.friendAccount.id,
    });

  _renderRow: (arg1: RenderItemProps<Row<Friend>>) => React.ReactElement<any> =
    ({ item }) => (
      <LoaderRow
        loadedRow={LoadedRow}
        loader={item.loader}
        onItemPress={this._onItemPress}
      />
    );

  render(): React.ReactElement {
    const isLoading = this._listStore.isFetchingRemoteCount;
    return (
      <List
        data={this._listStore.rows}
        keyExtractor={this._keyExtractor}
        ListEmptyComponent={
          !isLoading ? <ListEmpty message="No friends" /> : null
        }
        ListFooterComponent={<LoadingListFooter isLoading={isLoading} />}
        ListHeaderComponent={this.props.ListHeaderComponent}
        onEndReached={this._listStore.fetchNextPage}
        onRefresh={this._listStore.reload}
        renderItem={this._renderRow}
      />
    );
  }
}

const LoadedRow = ({
  item: friend,
  onItemPress,
}: RowItemProps<Friend>): React.ReactElement => (
  <ListItem
    leftAvatar={<UserAvatar userName={friend.friendAccount.userName} />}
    chevron={false}
    item={friend}
    onPress={onItemPress}
    title={friend.friendAccount.userName}
  />
);

export default FriendsList;
