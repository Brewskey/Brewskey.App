// @flow

import type { Notification } from '../../stores/NotificationsStore';

import * as React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import List from '../../common/List';
import ListEmptyComponent from '../../common/ListEmptyComponent';
import SwipeableRow from '../../common/SwipeableRow';
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

  _onItemOpen = (_, item) => {
    NotificationsStore.deleteByID(item.id);
  };

  _onNotificationReadEnd = (notification: Notification) =>
    NotificationsStore.setRead(notification.id);

  _renderItem = ({ item }: { item: Notification }): React.Element<any> => (
    <SwipeableRow
      item={item}
      onNotificationReadEnd={this._onNotificationReadEnd}
      onOpen={this._onItemOpen}
      rowItemComponent={SwipeableRowItem}
      slideoutComponent={() => <View />}
    />
  );

  render() {
    return (
      <List
        ListEmptyComponent={
          <ListEmptyComponent message="No new notifications!" />
        }
        data={NotificationsStore.notifications}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
      />
    );
  }
}

type SwipeableRowProps<TNotification: Notification> = {
  item: TNotification,
  onNotificationReadEnd: (notification: TNotification) => void,
};

const SwipeableRowItem = <TNotification: Notification>({
  item: notification,
  onNotificationReadEnd,
}: SwipeableRowProps<TNotification>) => {
  const ListItemComponent =
    LIST_ITEM_COMPONENT_BY_NOTIFICATION_TYPE[notification.type] || View;

  return (
    <ListItemComponent
      notification={notification}
      onPress={NotificationsStore.onNotificationPress}
      onReadEnd={onNotificationReadEnd}
    />
  );
};
export default NotificationsList;
