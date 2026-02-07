import type { EntityID } from '@brewskey/js-api';
import type {
  LowKegLevelNotification,
  NewAchievementNotification,
  NewFriendRequestNotification,
  Notification,
  TextNotification,
} from '../../src/stores/NotificationTypes';

const base = (
  overrides: Partial<{
    id: string;
    title: string;
    body: string;
    date: Date;
    isRead: boolean;
  }> = {},
) => ({
  id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  title: 'Test notification',
  body: 'Test body',
  date: new Date(),
  isRead: false,
  ...overrides,
});

export function createMockTextNotification(
  overrides?: Partial<TextNotification>,
): TextNotification {
  return {
    ...base(),
    type: 'text',
    ...overrides,
  };
}

export function createMockLowKegLevelNotification(
  overrides?: Partial<LowKegLevelNotification>,
): LowKegLevelNotification {
  return {
    ...base(),
    type: 'lowKegLevel',
    beverageId: 1,
    beverageName: 'Test Beverage',
    kegId: 1,
    tapId: 1,
    ...overrides,
  };
}

export function createMockNewAchievementNotification(
  overrides?: Partial<NewAchievementNotification>,
): NewAchievementNotification {
  return {
    ...base(),
    type: 'newAchievement',
    achievementType: 'BeerAficionado',
    ...overrides,
  };
}

export function createMockNewFriendRequestNotification(
  overrides?: Partial<NewFriendRequestNotification>,
): NewFriendRequestNotification {
  return {
    ...base(),
    type: 'newFriendRequest',
    friendId: 1 as EntityID,
    friendUserName: 'testfriend',
    ...overrides,
  };
}

/** One notification of each type for e2e list tests */
export function createMockNotificationsByType(): Notification[] {
  return [
    createMockTextNotification({ id: 'n-text-1' }),
    createMockLowKegLevelNotification({ id: 'n-lowkeg-1' }),
    createMockNewAchievementNotification({ id: 'n-achievement-1' }),
    createMockNewFriendRequestNotification({ id: 'n-friend-1' }),
  ];
}
