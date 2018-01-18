// @flow

import type { EntityID, LeaderboardItem } from 'brewskey.js-api';

import * as React from 'react';
import { observer } from 'mobx-react';
import FlatList from '../common/FlatList';
import LeaderboardListStore from '../stores/LeaderboardListStore';
import LoadingListFooter from '../common/LoadingListFooter';
import UserAvatar from '../common/avatars/UserAvatar';
import ListItem from '../common/ListItem';
import LeaderboardListEmpty from './LeaderboardListEmpty';
import NavigationService from '../NavigationService';

type Props = {|
  duration: string,
  ListHeaderComponent?: React.Node,
  tapID: EntityID,
|};

@observer
class LeaderboardList extends React.Component<Props> {
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
    // todo https://github.com/Brewskey/Brewskey.App/issues/111
    NavigationService.navigate('profile', {
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
