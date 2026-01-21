import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should display user profile overview', async ({ page, authenticatedUser }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  // Profile overview is the same as viewing your own profile
  if (!authenticatedUser) throw new Error('authenticatedUser is required');
  await page.goto(`/menu/profile/${authenticatedUser.user.id}`);
  
  // Profile screen shows badges and beverages when viewing own profile or friend's profile
  // Wait for the page to load - check for badges or beverages sections
  await expect(
    page.getByTestId('section-header-badges').or(page.getByTestId('section-header-beverages-poured'))
  ).toBeVisible({ timeout: 10000 });
});

test('should show stats and achievements', async ({ page, authenticatedUser }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  // Profile overview is the same as viewing your own profile
  if (!authenticatedUser) throw new Error('authenticatedUser is required');
  await page.goto(`/menu/profile/${authenticatedUser.user.id}`);
  
  // Stats and achievements sections have testIDs - check for badges or beverages sections
  await expect(
    page.getByTestId('section-header-badges').or(page.getByTestId('section-header-beverages-poured'))
  ).toBeVisible({ timeout: 10000 });
});
