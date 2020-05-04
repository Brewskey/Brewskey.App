// @flow

import type { LowKegLevelNotification } from '../../stores/NotificationsStore';
import type { Props as NotificationListItemProps } from './NotificationListItem';

import * as React from 'react';
import BeverageAvatar from '../../common/avatars/BeverageAvatar';
import NotificationListItem from './NotificationListItem';

type Props = {|
  ...NotificationListItemProps,
  notification: LowKegLevelNotification,
|};

const LowKegLevelListItem = (props: Props): React.Node => {
  const {
    notification: { beverageId },
  } = props;
  return (
    <NotificationListItem
      {...props}
      leftComponent={<BeverageAvatar beverageId={beverageId} size={75} />}
    />
  );
};

export default LowKegLevelListItem;
