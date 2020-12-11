// @flow

import type { TextNotification } from '../../stores/NotificationsStore';
import type { Props as NotificationListItemProps } from './NotificationListItem';

import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import BadgeIcon from '../BadgeIcon';
import BADGE_BY_TYPE from '../../badges';
import { COLORS, TYPOGRAPHY } from '../../theme';
import NotificationListItem from './NotificationListItem';

const styles = StyleSheet.create({
  badgeNameText: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.text,
  },
});

type Props = {|
  ...NotificationListItemProps,
  notification: TextNotification,
|};

const TextListItem = (props: Props): React.Node => {
  return (
    <NotificationListItem
      {...props}
    />
  );
};

export default TextListItem;
