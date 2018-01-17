// @flow

import type { Navigation } from '../types';
import type { EntityID, LeaderboardItem } from 'brewskey.js-api';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import FlatList from '../common/FlatList';
import { withNavigation } from 'react-navigation';
import LeaderboardListStore from '../stores/LeaderboardListStore';
import LoadingListFooter from '../common/LoadingListFooter';
import UserAvatar from '../common/avatars/UserAvatar';
import ListItem from '../common/ListItem';
import LeaderboardListEmpty from './LeaderboardListEmpty';

type Props = {|
  duration: string,
  ListHeaderComponent?: React.Node,
  tapID: EntityID,
|};

type InjectedProps = {|
  navigation: Navigation,
|};

@withNavigation
@observer
class LeaderboardList extends InjectedComponent<InjectedProps, Props> {
  _listStore: LeaderboardListStore = new LeaderboardListStore();

  componentWillMount() {
    const { duration, tapID } = this.props;
    this._listStore.setTapID(tapID);
    this._listStore.setDuration(duration);
    this._listStore.fetchFirstPage();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.duration !== nextProps.duration) {
      this._listStore.setDuration(nextProps.duration);
      this._listStore.reload();
    }
  }

  _keyExtractor = (item: LeaderboardItem): string => item.userName;

  _onListItemPress = ({ userID }: LeaderboardItem) =>
    this.injectedProps.navigation.navigate('profile', {
      id: userID,
    });

  _renderRow = ({
    item,
    index,
  }: {
    item: LeaderboardItem,
    index: number,
  }): React.Node => (
    <ListItem
      item={item}
      avatar={<UserAvatar userName={item.userName} />}
      hideChevron
      onPress={this._onListItemPress}
      subtitle={`${item.totalOunces.toFixed(1)} oz`}
      title={`${index + 1}. ${item.userName}`}
    />
  );

  render() {
    return (
      <FlatList
        data={this._listStore.rows}
        keyExtractor={this._keyExtractor}
        ListEmptyComponent={!this._listStore.isLoading && LeaderboardListEmpty}
        ListFooterComponent={
          <LoadingListFooter isLoading={this._listStore.isLoading} />
        }
        ListHeaderComponent={this.props.ListHeaderComponent}
        onEndReached={this._listStore.fetchNextPage}
        onRefresh={this._listStore.reload}
        renderItem={this._renderRow}
      />
    );
  }
}

export default LeaderboardList;
