import * as React from 'react';

import { NotificationListItem } from './NotificationListItem';

import type { Props as NotificationListItemProps } from './NotificationListItem';
import type { TextNotification } from '../../stores/NotificationTypes';

type Props = NotificationListItemProps & {
  notification: TextNotification;
};

const TextListItem = (props: Props): React.ReactElement => (
  <NotificationListItem {...props} />
);

export { TextListItem };
