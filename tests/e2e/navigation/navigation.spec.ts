import { test, expect } from '../../fixtures/test-fixtures';
import { mockAuthenticatedUser, mockLocationWithTaps } from '../../fixtures/entity-fixtures';
import { mockStore } from '../../fixtures/api-mocks';

test('should navigate between bottom tabs', async ({ page }) => {
  // Set up explicit data: authenticated user
  await mockAuthenticatedUser(page);

  // Home tab
  await page.goto('/');
  
  await expect(page).toHaveURL(/.*home|^\/$/);

  // Stats tab - use role-based locator for standard tab navigation
  // Tabs should be visible when user is authenticated
  const statsTab = page.getByRole('button', { name: /stats/i }).or(
    page.locator('a:has-text("Stats")')
  );
  await expect(statsTab.first()).toBeVisible();
  await statsTab.first().click();
  await expect(page).toHaveURL(/.*stats/i);

  // Notifications tab - use role-based locator for standard tab navigation
  // Tabs should be visible when user is authenticated
  const notificationsTab = page.getByRole('button', { name: /notifications/i }).or(
    page.locator('a:has-text("Notifications")')
  );
  await expect(notificationsTab.first()).toBeVisible();
  await notificationsTab.first().click();
  await expect(page).toHaveURL(/.*notifications/i);

  // Menu tab - use role-based locator for standard tab navigation
  // Tabs should be visible when user is authenticated
  const menuTab = page.getByRole('button', { name: /menu/i }).or(
    page.locator('a:has-text("Menu")')
  );
  await expect(menuTab.first()).toBeVisible();
  await menuTab.first().click();
  await expect(page).toHaveURL(/.*menu/i);
});

test('should redirect to login when signed out', async ({ page }) => {
  // Set up explicit data: no authenticated user (empty store)
  await page.goto('/');
  

  // Should redirect to login
  await expect(page).toHaveURL(/.*login/i);
});

test('should navigate back from detail screens', async ({ page }) => {
  // Set up explicit data: authenticated user with one location
  await mockAuthenticatedUser(page);
  const { location } = await mockLocationWithTaps(page, 0);

  await page.goto('/locations');
  
  
  // Location name is dynamic content, so text-based locator is acceptable
  await page.click(`text=${location.name}`);
  

  // Back button - use role-based locator for standard navigation button
  // Back button should be visible on detail screens
  const backButton = page.getByRole('button', { name: /back/i }).or(
    page.locator('button[aria-label*="back" i]')
  );
  await expect(backButton.first()).toBeVisible();
  await backButton.first().click();
  await expect(page).toHaveURL(/.*locations/i);
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
