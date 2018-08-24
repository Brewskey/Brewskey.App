// @flow

import type { Friend } from 'brewskey.js-api';
import type { Row } from '../stores/DAOListStore';
import type { Navigation, Section } from '../types';

import * as React from 'react';
import { observer } from 'mobx-react/native';
import { computed } from 'mobx';
import { withNavigation } from 'react-navigation';
import DAOApi, { FRIEND_STATUSES } from 'brewskey.js-api';
import InjectedComponent from '../common/InjectedComponent';
import LoadingListFooter from '../common/LoadingListFooter';
import List from '../common/List';
import LoaderRow from '../common/LoaderRow';
import ListSectionHeader from '../common/ListSectionHeader';
import FriendPendingRequestListItem from './FriendPendingRequestListItem';
import FriendMyRequestListItem from './FriendMyRequestListItem';
import FriendRequestsListStore from '../stores/FriendRequestsListStore';
import ListEmpty from '../common/ListEmpty';

type InjectedProps = {
  navigation: Navigation,
};

@withNavigation
@observer
class FriendRequestsList extends InjectedComponent<InjectedProps> {
  @computed
  get _sections(): Array<Section<Row<Friend>>> {
    return FriendRequestsListStore.isLoading
      ? []
      : [
          {
            data: FriendRequestsListStore.pendingRequestsLoaderRows,
            renderItem: ({ item }: { item: Row<Friend> }) => (
              <LoaderRow
                loadedRow={FriendPendingRequestListItem}
                loader={item.loader}
                onFriendAcceptPress={this._onFriendAcceptPress}
                onFriendDeclinePress={this._onFriendDeclinePress}
                onPress={this._onPendingRequestRowPress}
              />
            ),
            title: 'Pending requests',
          },
          {
            data: FriendRequestsListStore.myRequestsLoaderRows,
            renderItem: ({ item }: { item: Row<Friend> }) => (
              <LoaderRow
                loadedRow={FriendMyRequestListItem}
                loader={item.loader}
                onFriendCancelMyRequestPress={
                  this._onFriendCancelMyRequestPress
                }
                onPress={this._onMyRequestRowPress}
              />
            ),
            title: 'My requests',
          },
        ];
  }

  _onPendingRequestRowPress = (friend: Friend) =>
    this.injectedProps.navigation.navigate('profile', {
      id: friend.owningAccount.id,
    });

  _onMyRequestRowPress = (friend: Friend) =>
    this.injectedProps.navigation.navigate('profile', {
      id: friend.friendAccount.id,
    });

  _onFriendAcceptPress = (friend: Friend) => {
    DAOApi.FriendDAO.put(friend.id, {
      ...friend,
      friendStatus: FRIEND_STATUSES.APPROVED,
    });
    FriendRequestsListStore.reload();
  };

  _onFriendDeclinePress = ({ id }: Friend) => DAOApi.FriendDAO.deleteByID(id);

  _onFriendCancelMyRequestPress = ({ id }: Friend) =>
    DAOApi.FriendDAO.deleteByID(id);

  _keyExtractor = ({ key }: Row<Friend>): string => key.toString();

  _renderSectionHeader = ({ section }): React.Element<any> => (
    <ListSectionHeader title={section.title} />
  );

  _renderSectionFooter = ({ section: { data } }): ?React.Element<any> =>
    !data.length ? <ListEmpty message="No requests" /> : null;

  render() {
    return (
      <List
        keyExtractor={this._keyExtractor}
        ListFooterComponent={
          <LoadingListFooter isLoading={FriendRequestsListStore.isLoading} />
        }
        listType="sectionList"
        onRefresh={FriendRequestsListStore.reload}
        renderSectionHeader={this._renderSectionHeader}
        renderSectionFooter={this._renderSectionFooter}
        sections={this._sections}
      />
    );
  }
}

export default FriendRequestsList;
