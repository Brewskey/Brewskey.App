// @flow

import type { NewAchievementNotification } from '../../stores/NotificationsStore';
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
  notification: NewAchievementNotification,
|};

const AchievementListItem = (props: Props): React.Node => {
  const {
    notification: { achievementType },
  } = props;
  const badge = BADGE_BY_TYPE[achievementType];

  return (
    <NotificationListItem
      {...props}
      contentComponent={
        <View>
          <Text style={styles.badgeNameText}>{badge.name}</Text>
          <Text>{badge.description}</Text>
        </View>
      }
      leftComponent={<BadgeIcon achievementType={achievementType} />}
    />
  );
};

export default AchievementListItem;
