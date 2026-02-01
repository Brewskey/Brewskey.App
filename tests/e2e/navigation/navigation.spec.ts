import { test, expect } from '../../fixtures/test-fixtures';
import {
  mockAuthenticatedUser,
  mockLocationWithTaps,
} from '../../fixtures/entity-fixtures';
import { mockStore } from '../../fixtures/api-mocks';

test('should navigate between bottom tabs', async ({ page }) => {
  // Set up explicit data: authenticated user
  await mockAuthenticatedUser(page);

  // Home tab
  await page.goto('/');

  // Home route may be at root or /home - check pathname
  const url = new URL(page.url());
  expect(url.pathname === '/' || url.pathname.includes('home')).toBeTruthy();

  // Stats tab has testID - use that instead of text-based locator
  const statsTab = page.getByTestId('tab-stats');
  await expect(statsTab).toBeVisible();
  await statsTab.click();
  // Expo Router may keep URL at / when switching tabs; assert on stats content
  await expect(page.getByTestId('badges-section')).toBeVisible();

  // Notifications tab has testID - use that instead of text-based locator
  const notificationsTab = page.getByTestId('tab-notifications');
  await expect(notificationsTab).toBeVisible();
  await notificationsTab.click();
  await expect(page.getByTestId('button-delete-all-notifications')).toBeVisible();

  // Menu tab has testID - use that instead of text-based locator
  const menuTab = page.getByTestId('tab-menu');
  await expect(menuTab).toBeVisible();
  await menuTab.click();
  await expect(page.getByTestId('menu-user-block')).toBeVisible();
});

test('should redirect to login when signed out', async ({ page }) => {
  // Set up explicit data: no authenticated user (empty store)
  await page.goto('/');

  // Should redirect to login
  await expect(page).toHaveURL(/.*login/i);
});

test('should navigate back from detail screens', async ({ page }) => {
  // Set up explicit data: authenticated user with one device (device details works, location details is blocked)
  await mockAuthenticatedUser(page);
  const { devices } = await mockLocationWithTaps(page, 0);

  await page.goto('/devices');

  // Device item has testID
  await expect(page.getByTestId(`device-item-${devices[0].id}`)).toBeVisible();
  await page.getByTestId(`device-item-${devices[0].id}`).click();

  // Wait for device details page to load
  await expect(page.getByTestId('overview-item-box-id')).toBeVisible();

  // Use browser back navigation to test navigation works
  await page.goBack();
  await expect(page).toHaveURL(/.*devices/i);
});

test('should handle deep linking', async ({ page }) => {
  // Set up explicit data: authenticated user with tap ID 1
  await mockAuthenticatedUser(page);
  const { taps } = await mockLocationWithTaps(page, 1);

  // Update tap ID to 1 for deep link test
  const tapWithId1 = { ...taps[0], id: 1 as any };
  mockStore.setTap(tapWithId1);

  await page.goto('/taps/1');

  await expect(page).toHaveURL(/.*taps.*1/i);
});
