// @flow

import type { NewFriendRequestNotification } from '../../stores/NotificationsStore';
import type { props as NotificationListItemProps } from './NotificationListItem';

import * as React from 'react';
import UserAvatar from '../../common/avatars/UserAvatar';
import NotificationListItem from './NotificationListItem';

const FriendRequestListItem = (
  props: NotificationListItemProps<NewFriendRequestNotification>,
) => {
  const { notification: { friendUserName } } = props;
  return (
    <NotificationListItem
      {...props}
      leftComponent={<UserAvatar size={75} userName={friendUserName} />}
    />
  );
};

export default FriendRequestListItem;
