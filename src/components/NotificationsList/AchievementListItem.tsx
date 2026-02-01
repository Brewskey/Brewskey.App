import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { BADGE_BY_TYPE } from 'badges';
import { BadgeIcon } from 'components/BadgeIcon';
import { NotificationListItem } from 'components/NotificationsList/NotificationListItem';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { Props as NotificationListItemProps } from 'components/NotificationsList/NotificationListItem';
import type { NewAchievementNotification } from 'stores/NotificationTypes';

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
