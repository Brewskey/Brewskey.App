// @flow

import type { Navigation } from '../types';
import type { EntityID, LeaderboardItem } from 'brewskey.js-api';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import List from '../common/List';
import { withNavigation } from 'react-navigation';
import LeaderboardListStore from '../stores/LeaderboardListStore';
import LoadingListFooter from '../common/LoadingListFooter';
import UserAvatar from '../common/avatars/UserAvatar';
import ListItem from '../common/ListItem';
import LeaderboardListEmpty from './LeaderboardListEmpty';

type Props = {|
  duration: string,
  ListHeaderComponent?: ?(React.ComponentType<any> | React.Element<any>),
  tapID: EntityID,
|};

type InjectedProps = {|
  navigation: Navigation,
|};

@withNavigation
@observer
class LeaderboardList extends InjectedComponent<InjectedProps, Props> {
  _listStore: LeaderboardListStore = new LeaderboardListStore();

  componentDidMount() {
    const { duration, tapID } = this.props;
    this._listStore.initialize({ duration, tapID });
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.duration !== prevProps.duration) {
      this._listStore.setDuration(this.props.duration);
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
  }): React.Element<any> => (
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
      <List
        data={this._listStore.rows}
        keyExtractor={this._keyExtractor}
        ListEmptyComponent={
          !this._listStore.isLoading ? LeaderboardListEmpty : null
        }
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
