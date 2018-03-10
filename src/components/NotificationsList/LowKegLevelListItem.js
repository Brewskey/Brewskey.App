// @flow

import type { LowKegLevelNotification } from '../../stores/NotificationsStore';
import type { props as NotificationListItemProps } from './NotificationListItem';

import * as React from 'react';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import NotificationListItem from './NotificationListItem';

const LowKegLevelListItem = (
  props: NotificationListItemProps<LowKegLevelNotification>,
) => {
  const { notification: { beverageId } } = props;
  return (
    <NotificationListItem
      {...props}
      leftComponent={<BeverageAvatar beverageId={beverageId} size={75} />}
    />
  );
};

export default LowKegLevelListItem;
