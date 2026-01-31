import * as React from 'react';

import { NotificationListItem } from 'components/NotificationsList/NotificationListItem';
import { BeverageAvatar } from 'common/avatars/BeverageAvatar';

import type { Props as NotificationListItemProps } from 'components/NotificationsList/NotificationListItem';
import type { LowKegLevelNotification } from 'stores/NotificationTypes';

type Props = NotificationListItemProps & {
  notification: LowKegLevelNotification;
};

const LowKegLevelListItem = (props: Props): React.ReactElement => {
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

export { LowKegLevelListItem };
