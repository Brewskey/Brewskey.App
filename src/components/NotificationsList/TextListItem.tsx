import * as React from 'react';

import { NotificationListItem } from 'components/NotificationsList/NotificationListItem';

import type { Props as NotificationListItemProps } from 'components/NotificationsList/NotificationListItem';
import type { TextNotification } from 'stores/NotificationTypes';

type Props = NotificationListItemProps & {
  notification: TextNotification;
};

const TextListItem = (props: Props): React.ReactElement => (
  <NotificationListItem {...props} />
);

export { TextListItem };
