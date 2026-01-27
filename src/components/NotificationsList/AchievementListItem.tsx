import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { NotificationListItem } from './NotificationListItem';
import { BADGE_BY_TYPE } from '../../badges';
import { COLORS, TYPOGRAPHY } from '../../theme';
import { BadgeIcon } from '../BadgeIcon';

import type { Props as NotificationListItemProps } from './NotificationListItem';
import type { NewAchievementNotification } from '../../stores/NotificationTypes';

const styles = StyleSheet.create({
  badgeNameText: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.text,
  },
});

type Props = NotificationListItemProps & {
  notification: NewAchievementNotification;
};

const AchievementListItem = (props: Props): React.ReactElement => {
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
      leftComponent={
        <BadgeIcon achievementType={achievementType} size="small" />
      }
    />
  );
};

export { AchievementListItem };
