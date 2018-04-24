// @flow

import type { Notification } from '../../stores/NotificationsStore';

import * as React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import List from '../../common/List';
import ErrorBoundary from '../../common/ErrorBoundary';
import ErrorListItem from '../../common/ErrorListItem';
import ListEmpty from '../../common/ListEmpty';
import NotificationsStore from '../../stores/NotificationsStore';
import LowKegLevelListItem from './LowKegLevelListItem';
import AchievementListItem from './AchievementListItem';
import FriendRequestListItem from './FriendRequestListItem';

const LIST_ITEM_COMPONENT_BY_NOTIFICATION_TYPE = {
  lowKegLevel: LowKegLevelListItem,
  newAchievement: AchievementListItem,
  newFriendRequest: FriendRequestListItem,
};

@observer
class NotificationsList extends React.Component<{}> {
  _keyExtractor = notification => notification.id;

  _onItemOpen = (notification: Notification) => {
    NotificationsStore.deleteByID(notification.id);
  };

  _onNotificationReadEnd = (notification: Notification) =>
    NotificationsStore.setRead(notification.id);

  _renderItem = ({ item }: { item: Notification }): React.Element<any> => {
    const ListItemComponent =
      LIST_ITEM_COMPONENT_BY_NOTIFICATION_TYPE[item.type] || View;

    return (
      <ErrorBoundary fallbackComponent={ErrorListItem}>
        <ListItemComponent
          notification={(item: any)}
          onOpen={this._onItemOpen}
          onPress={NotificationsStore.onNotificationPress}
          onReadEnd={this._onNotificationReadEnd}
        />
      </ErrorBoundary>
    );
  };

  render() {
    return (
      <List
        data={NotificationsStore.notifications}
        keyExtractor={this._keyExtractor}
        ListEmptyComponent={<ListEmpty message="No new notifications!" />}
        renderItem={this._renderItem}
      />
    );
  }
}

export default NotificationsList;
