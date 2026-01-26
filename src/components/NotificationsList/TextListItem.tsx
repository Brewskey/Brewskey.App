import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import NotificationListItem from './NotificationListItem';
import BADGE_BY_TYPE from '../../badges';
import { COLORS, TYPOGRAPHY } from '../../theme';
import BadgeIcon from '../BadgeIcon';

import type { Props as NotificationListItemProps } from './NotificationListItem';
import type { TextNotification } from '../../stores/NotificationTypes';

const styles = StyleSheet.create({
  badgeNameText: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.text,
  },
});

type Props = NotificationListItemProps & {
  notification: TextNotification;
};

const TextListItem = (props: Props): React.ReactElement => (
  <NotificationListItem {...props} />
);

export default TextListItem;
