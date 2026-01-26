import type { AchievementType, EntityID } from '@brewskey/js-api';

export interface BaseNotificationProps {
  body: string;
  date: Date;
  id: string;
  isRead: boolean;
  title: string;
}

export type LowKegLevelNotification = BaseNotificationProps & {
  beverageId: EntityID;
  beverageName: string;
  kegId: EntityID;
  tapId: EntityID;
  type: 'lowKegLevel';
};

export type NewAchievementNotification = BaseNotificationProps & {
  achievementType: AchievementType;
  type: 'newAchievement';
};

export type NewFriendRequestNotification = BaseNotificationProps & {
  friendId: EntityID;
  friendUserName: string;
  type: 'newFriendRequest';
};

export type TextNotification = BaseNotificationProps & {
  type: 'text';
};

export type Notification =
  | LowKegLevelNotification
  | NewAchievementNotification
  | NewFriendRequestNotification
  | TextNotification;
