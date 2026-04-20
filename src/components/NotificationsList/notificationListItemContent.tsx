import * as React from 'react';

import { Text } from 'react-native';

import { BADGE_BY_TYPE } from 'badges';
import { BeverageAvatar } from 'common/avatars/BeverageAvatar';
import { UserAvatar } from 'common/avatars/UserAvatar';
import { BadgeIcon } from 'components/BadgeIcon';
import { COLORS, TYPOGRAPHY } from 'theme';
import { fromNow } from 'utils/dateFormat';

import type { Notification } from 'stores/NotificationTypes';

const dateStyle = { color: COLORS.textFaded };

export interface NotificationListItemContent {
  leftAvatar: React.ReactNode | undefined;
  subtitle: React.ReactNode;
  title: string;
}

const formatDate = (date: Date | unknown): string =>
  fromNow(date instanceof Date ? date : (date as string));

/**
 * Maps a notification to title, subtitle, and leftAvatar for use with common/ListItem.
 * Keeps notification list rendering DRY and consistent with RNE list patterns.
 */
export function getNotificationListItemContent(
  notification: Notification,
): NotificationListItemContent {
  const { title } = notification;
  const dateSubtitle = (
    <Text style={dateStyle}>{formatDate(notification.date)}</Text>
  );

  switch (notification.type) {
    case 'lowKegLevel':
      return {
        leftAvatar: (
          <BeverageAvatar beverageId={notification.beverageId} size={40} />
        ),
        subtitle: dateSubtitle,
        title,
      };
    case 'newAchievement':
      return (() => {
        const badge = BADGE_BY_TYPE[notification.achievementType];
        return {
          leftAvatar: (
            <BadgeIcon
              achievementType={notification.achievementType}
              size="small"
            />
          ),
          subtitle: badge ? (
            <React.Fragment>
              {dateSubtitle}
              <Text style={[TYPOGRAPHY.paragraph, { color: COLORS.text }]}>
                {badge.name}
                {badge.description ? ` – ${badge.description}` : ''}
              </Text>
            </React.Fragment>
          ) : (
            dateSubtitle
          ),
          title,
        };
      })();
    case 'newFriendRequest':
      return {
        leftAvatar: (
          <UserAvatar size={40} userName={notification.friendUserName} />
        ),
        subtitle: dateSubtitle,
        title,
      };
    default:
      return {
        leftAvatar: undefined,
        subtitle: (
          <React.Fragment>
            {dateSubtitle}
            {notification.body ? (
              <Text style={[TYPOGRAPHY.paragraph, { color: COLORS.text }]}>
                {notification.body}
              </Text>
            ) : null}
          </React.Fragment>
        ),
        title,
      };
  }
}
