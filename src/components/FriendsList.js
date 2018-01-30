// @flow

import type { Friend, QueryOptions } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type { Row } from '../stores/DAOListStore';
import type { RowItemProps } from '../common/SwipeableRow';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { withNavigation } from 'react-navigation';
import { observer } from 'mobx-react';
import DAOListStore from '../stores/DAOListStore';
import { FriendStore } from '../stores/DAOStores';
import List from '../common/List';
import LoaderRow from '../common/LoaderRow';
import UserAvatar from '../common/avatars/UserAvatar';
import ListItem from '../common/ListItem';
import LoadingListFooter from '../common/LoadingListFooter';

type Props = {|
  ListHeaderComponent?: React.Node,
  queryOptions?: QueryOptions,
  showPhoneNumber?: boolean,
|};

type InjectedProps = {|
  navigation: Navigation,
|};

@withNavigation
@observer
class FriendsList extends InjectedComponent<InjectedProps, Props> {
  static defaultProps = {
    queryOptions: {},
  };

  _listStore: DAOListStore<Friend> = new DAOListStore(FriendStore);

  componentWillMount() {
    this._listStore.setQueryOptions({
      ...this.props.queryOptions,
    });

    this._listStore.fetchFirstPage();
  }

  _keyExtractor = (row: Row<Friend>): number => row.key;

  _onListItemPress = (friend: Friend) =>
    this.injectedProps.navigation.navigate('profile', {
      id: friend.friendAccount.id,
    });

  _renderRow = ({ item }: { item: Row<Friend> }): React.Node => (
    <LoaderRow
      loadedRow={LoadedRow}
      loader={item.loader}
      onListItemPress={this._onListItemPress}
      showPhoneNumber={this.props.showPhoneNumber}
    />
  );

  render() {
    return (
      <List
        data={this._listStore.rows}
        keyExtractor={this._keyExtractor}
        ListFooterComponent={
          <LoadingListFooter
            isLoading={this._listStore.isFetchingRemoteCount}
          />
        }
        ListHeaderComponent={this.props.ListHeaderComponent}
        onEndReached={this._listStore.fetchNextPage}
        renderItem={this._renderRow}
      />
    );
  }
}

const LoadedRow = ({
  item: friend,
  onListItemPress,
  showPhoneNumber,
}: RowItemProps<Friend, *>) => (
  <ListItem
    avatar={<UserAvatar userName={friend.friendAccount.userName} />}
    hideChevron
    item={friend}
    onPress={onListItemPress}
    subtitle={showPhoneNumber ? friend.friendAccount.phoneNumber : ''}
    title={friend.friendAccount.userName}
  />
);

export default FriendsList;
