import type { EntityID, LeaderboardItem } from '@brewskey/js-api';

import * as React from 'react';

import List from '../common/List';

import LeaderboardListStore from '../stores/LeaderboardListStore';
import LoadingListFooter from '../common/LoadingListFooter';
import PintCounter from '../components/PintCounter';
import UserAvatar from '../common/avatars/UserAvatar';
import ListItem from '../common/ListItem';
import ListEmpty from '../common/ListEmpty';

type Props = {
  duration: string;
  ListHeaderComponent?:
    | React.ComponentType<any>
    | React.ReactNode
    | null
    | undefined;
  tapID: EntityID;
};

type InjectedProps = {
  navigation: Navigation;
};

@withNavigation
class LeaderboardList extends InjectedComponent<InjectedProps, Props> {
  _listStore: LeaderboardListStore = new LeaderboardListStore();
  iterator: number = 1;

  componentDidMount() {
    const { duration, tapID } = this.props;
    this._listStore.initialize({ duration, tapID });
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.duration !== prevProps.duration) {
      this._listStore.setDuration(this.props.duration);
    }
  }

  _keyExtractor = (item: LeaderboardItem): string => {
    this.iterator += 1;
    return item.userName || this.iterator.toString();
  };

  _onItemPress = ({ userID }: LeaderboardItem) =>
    this.injectedProps.navigation.navigate('profile', {
      id: userID,
    });

  _renderRow = ({
    item,
    index,
  }: {
    item: LeaderboardItem;
    index: number;
  }): React.ReactElement => (
    <ListItem
      leftAvatar={<UserAvatar userName={item.userName || ''} />}
      item={item}
      onPress={item.userID ? this._onItemPress : undefined}
      rightIcon={<PintCounter beverageID={null} ounces={item.totalOunces} />}
      subtitle={`${item.totalOunces.toFixed(1)} oz`}
      title={`${index + 1}. ${item.userName || ''}`}
    />
  );

  render(): React.ReactElement {
    return (
      <List
        data={this._listStore.rows}
        keyExtractor={this._keyExtractor}
        ListEmptyComponent={
          !this._listStore.isLoading ? (
            <ListEmpty message="There is nobody on the leaderboard for selected period!" />
          ) : null
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
