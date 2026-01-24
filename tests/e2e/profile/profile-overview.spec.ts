import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should display user profile overview', async ({ page, authenticatedUser }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  // Profile overview is the same as viewing your own profile
  if (!authenticatedUser) throw new Error('authenticatedUser is required');
  await page.goto(`/menu/profile/${authenticatedUser.user.id}`);
  
  // Profile screen has testID - wait for it to load
  await expect(page.getByTestId('profile-content')).toBeVisible();
  
  // Profile screen shows badges and beverages sections when available
  // At least one section should be visible (badges or beverages)
  const badgesSection = page.getByTestId('section-header-badges');
  const beveragesSection = page.getByTestId('section-header-beverages-poured');
  // Check that at least one section is visible
  await expect(badgesSection.or(beveragesSection)).toBeVisible();
});

test('should show stats and achievements', async ({ page, authenticatedUser }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  // Profile overview is the same as viewing your own profile
  if (!authenticatedUser) throw new Error('authenticatedUser is required');
  await page.goto(`/menu/profile/${authenticatedUser.user.id}`);
  
  // Profile screen has testID - wait for it to load
  await expect(page.getByTestId('profile-content')).toBeVisible();
  
  // Stats and achievements sections have testIDs - check for badges or beverages sections
  // At least one section should be visible
  const badgesSection = page.getByTestId('section-header-badges');
  const beveragesSection = page.getByTestId('section-header-beverages-poured');
  await expect(badgesSection.or(beveragesSection)).toBeVisible();
});
