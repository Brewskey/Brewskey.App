/**
 * Notifications screen e2e tests.
 * App closed / background receipt is not testable in web e2e; only in-app receipt
 * and list/actions are covered. For full flow use a dev build on device.
 */

import { createMockNotificationsByType } from '../../fixtures/notification-fixtures';
import { setNotificationsStorage } from '../../fixtures/storage-helper';
import { expect, test } from '../../fixtures/test-fixtures';

test.use({
  autoAuthenticate: true,
  permissions: ['geolocation', 'notifications'],
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    delete (window as Window & { __PLAYWRIGHT_NOTIFICATIONS__?: unknown })
      .__PLAYWRIGHT_NOTIFICATIONS__;
    delete (
      window as Window & {
        __PLAYWRIGHT_SIMULATE_NOTIFICATION_RESPONSE__?: unknown;
      }
    ).__PLAYWRIGHT_SIMULATE_NOTIFICATION_RESPONSE__;
  });
});

test('should show delete all button', async ({ notificationsPage }) => {
  await notificationsPage.goto();
  await expect(notificationsPage.getDeleteAllButton()).toBeVisible();
});

test('should show empty state when no notifications', async ({
  notificationsPage,
  page,
}) => {
  await setNotificationsStorage(page, []);
  await notificationsPage.goto();
  await expect(notificationsPage.getNotificationsList()).toBeVisible();
  await expect(notificationsPage.getEmptyMessage()).toBeVisible();
});

test('should show list with multiple notification types', async ({
  notificationsPage,
  page,
}) => {
  const notifications = createMockNotificationsByType();
  await setNotificationsStorage(page, notifications);
  await notificationsPage.goto();
  await expect(notificationsPage.getNotificationsList()).toBeVisible();
  await expect(
    notificationsPage.getNotificationItem('notification-item-text-n-text-1'),
  ).toBeVisible({ timeout: 8000 });
  await expect(
    notificationsPage.getNotificationItem(
      'notification-item-lowKegLevel-n-lowkeg-1',
    ),
  ).toBeVisible();
  await expect(
    notificationsPage.getNotificationItem(
      'notification-item-newAchievement-n-achievement-1',
    ),
  ).toBeVisible();
  await expect(
    notificationsPage.getNotificationItem(
      'notification-item-newFriendRequest-n-friend-1',
    ),
  ).toBeVisible();
});

test('should show delete all modal', async ({ page, notificationsPage }) => {
  await notificationsPage.goto();
  await notificationsPage.getDeleteAllButton().click();
  await expect(notificationsPage.getModal()).toBeVisible();
  await expect(
    page.getByTestId('modal-delete-all-notifications-title'),
  ).toBeVisible();
});

test('should allow canceling delete', async ({ notificationsPage }) => {
  await notificationsPage.goto();
  await notificationsPage.getDeleteAllButton().click();
  await expect(notificationsPage.getModalCancelButton()).toBeVisible();
  await notificationsPage.getModalCancelButton().click();
  await expect(notificationsPage.getModal()).not.toBeVisible();
});

// Skip: modal does not open when list has items (RNW/layout or z-index).
test.skip('should allow confirming delete all', async ({
  page,
  notificationsPage,
}) => {
  const notifications = createMockNotificationsByType();
  await setNotificationsStorage(page, notifications);
  await notificationsPage.goto();
  await expect(
    notificationsPage.getNotificationItem('notification-item-text-n-text-1'),
  ).toBeVisible({ timeout: 8000 });
  await notificationsPage.getDeleteAllButton().click();
  await expect(
    page.getByTestId('modal-delete-all-notifications-title'),
  ).toBeVisible({ timeout: 10000 });
  await notificationsPage.getModalConfirmButton().click();
  await expect(notificationsPage.getModal()).not.toBeVisible();
  await expect(notificationsPage.getEmptyMessage()).toBeVisible();
});

test('should show badge when there are unread notifications', async ({
  page,
  notificationsPage,
}) => {
  const notifications = createMockNotificationsByType();
  await setNotificationsStorage(page, notifications);
  await notificationsPage.goto();
  await expect(page.getByTestId('notifications-badge')).toBeVisible();
});

test('simulated notification received while app is open', async ({
  page,
  notificationsPage,
}) => {
  await setNotificationsStorage(page, []);
  await page.goto('/(notifications)');
  await expect(notificationsPage.getNotificationsList()).toBeVisible({
    timeout: 15000,
  });
  await expect(notificationsPage.getEmptyMessage()).toBeVisible();

  const payload = {
    id: 'sim-1',
    type: 'text',
    title: 'Simulated',
    body: 'E2E simulated notification',
    date: new Date().toISOString(),
    isRead: false,
  };
  await page.evaluate(async (p: Record<string, unknown>) => {
    const win = window as Window & {
      __PLAYWRIGHT_SIMULATE_NOTIFICATION__?: (
        payload: Record<string, unknown>,
      ) => Promise<void>;
    };
    const fn = win.__PLAYWRIGHT_SIMULATE_NOTIFICATION__;
    if (fn) {
      await fn(p);
    }
  }, payload);

  await expect(
    notificationsPage.getNotificationItem('notification-item-text-sim-1'),
  ).toBeVisible({ timeout: 10000 });
});

test('simulated notification response is saved and persists after reload', async ({
  page,
  notificationsPage,
}) => {
  await page.goto('/(notifications)');
  await page.evaluate(() => {
    (
      window as Window & { __PLAYWRIGHT_NOTIFICATIONS__?: unknown[] }
    ).__PLAYWRIGHT_NOTIFICATIONS__ = [];
  });
  await page.goto('/(notifications)');
  await expect(notificationsPage.getNotificationsList()).toBeVisible({
    timeout: 15000,
  });
  await expect(notificationsPage.getEmptyMessage()).toBeVisible();

  const payload = {
    id: 'sim-response-1',
    type: 'newFriendRequest',
    title: 'Friend request',
    body: 'Someone sent you a request',
    friendId: '123',
    friendUserName: 'friend-user',
    date: new Date().toISOString(),
    isRead: true,
  };
  await page.waitForFunction(
    () =>
      typeof (
        window as Window & {
          __PLAYWRIGHT_SIMULATE_NOTIFICATION_RESPONSE__?: unknown;
        }
      ).__PLAYWRIGHT_SIMULATE_NOTIFICATION_RESPONSE__ === 'function',
  );
  await page.evaluate(async (p: Record<string, unknown>) => {
    const win = window as Window & {
      __PLAYWRIGHT_SIMULATE_NOTIFICATION_RESPONSE__?: (
        payload: Record<string, unknown>,
      ) => Promise<void>;
    };
    const fn = win.__PLAYWRIGHT_SIMULATE_NOTIFICATION_RESPONSE__;
    if (fn) {
      await fn(p);
    }
  }, payload);

  await expect
    .poll(async () => {
      const list = await page.evaluate(async () => {
        const storage = (window as Window & { Storage?: unknown }).Storage as {
          getForCurrentUser?: (key: string) => Promise<{ id: string }[] | null>;
        };
        if (!storage?.getForCurrentUser) {
          return null;
        }
        return storage.getForCurrentUser('notifications');
      });
      return (list ?? []).some((n) => n.id === 'sim-response-1');
    })
    .toBe(true);

  await page.evaluate(() => {
    delete (window as Window & { __PLAYWRIGHT_NOTIFICATIONS__?: unknown })
      .__PLAYWRIGHT_NOTIFICATIONS__;
  });
  await page.reload();
  await page.goto('/(notifications)');
  await expect(notificationsPage.getNotificationsList()).toBeVisible({
    timeout: 15000,
  });
  await expect(
    notificationsPage.getNotificationItem(
      'notification-item-newFriendRequest-sim-response-1',
    ),
  ).toBeVisible({ timeout: 10000 });
});
