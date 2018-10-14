// @flow

import type { Friend, QueryOptions } from 'brewskey.js-api';
import type { Navigation } from '../types';
import type { Row } from '../stores/DAOListStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { observer } from 'mobx-react/native';
import DAOListStore from '../stores/DAOListStore';
import { FriendStore } from '../stores/DAOStores';
import List from '../common/List';
import ListEmpty from '../common/ListEmpty';
import LoaderRow from '../common/LoaderRow';
import UserAvatar from '../common/avatars/UserAvatar';
import LoadingListFooter from '../common/LoadingListFooter';
import BaseAvatar from '../common/avatars/BaseAvatar';
import { COLORS } from '../theme';

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

type Props = {|
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Element<any>),
  queryOptions?: QueryOptions,
|};

type InjectedProps = {|
  navigation: Navigation,
|};

@withNavigation
@observer
class FriendsHorizontalList extends InjectedComponent<InjectedProps, Props> {
  static defaultProps = {
    queryOptions: {},
  };

  _listStore: DAOListStore<Friend> = new DAOListStore(FriendStore);

  componentDidMount() {
    this._listStore.initialize(this.props.queryOptions);
  }

  _keyExtractor = (row: Row<Friend>): string => row.key;

  _onListItemPress = (friend: Friend) => {
    this.injectedProps.navigation.navigate('profile', {
      id: friend.friendAccount.id,
      key: friend.friendAccount.id,
    });
  };

  _renderRow = ({ item }: { item: Row<Friend> }): React.Element<any> => (
    <LoaderRow
      loadedRow={LoadedRow}
      loader={item.loader}
      loadingRow={LoadingRow}
      onListItemPress={this._onListItemPress}
    />
  );

  render() {
    const isLoading = this._listStore.isFetchingRemoteCount;
    return (
      <List
        data={this._listStore.rows}
        horizontal
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

const LoadingRow = () => (
  <View style={styles.friendContainer}>
    <BaseAvatar size={100} />
    <View style={styles.userNameLoadingPlaceholder} />
  </View>
);

type LoadedRowProps = {
  item: Friend,
  onListItemPress: Friend => void,
};

class LoadedRow extends React.PureComponent<LoadedRowProps> {
  _onPress = () => {
    const { item, onListItemPress } = this.props;
    onListItemPress(item);
  };
  render() {
    const { item: friend } = this.props;
    return (
      <TouchableOpacity onPress={this._onPress} style={styles.friendContainer}>
        <UserAvatar size={100} userName={friend.friendAccount.userName} />
        <Text style={styles.userNameText}>{friend.friendAccount.userName}</Text>
      </TouchableOpacity>
    );
  }
}

export default FriendsHorizontalList;
