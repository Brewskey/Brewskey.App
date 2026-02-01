import * as React from 'react';

import { UserAvatar } from 'common/avatars/UserAvatar';
import { NotificationListItem } from 'components/NotificationsList/NotificationListItem';

import type { Props as NotificationListItemProps } from 'components/NotificationsList/NotificationListItem';
import type { NewFriendRequestNotification } from 'stores/NotificationTypes';

type Props = NotificationListItemProps & {
  notification: NewFriendRequestNotification;
};

const FriendRequestListItem = (props: Props): React.ReactElement => {
  const {
    notification: { friendUserName },
  } = props;
  return (
    <NotificationListItem
      {...props}
      leftComponent={<UserAvatar size={75} userName={friendUserName} />}
    />
  );
};

export { FriendRequestListItem };
