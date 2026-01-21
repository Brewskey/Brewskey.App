import { test, expect } from '../../fixtures/test-fixtures';
import { createMockUser } from '../../fixtures/test-data';
import { mockStore } from '../../fixtures/api-mocks';

test.use({ autoAuthenticate: true });

test('should display user profile', async ({ page }) => {
  // Set up explicit data: another user's profile
  const otherUser = createMockUser({ userName: 'otheruser' });
  mockStore.setUser(otherUser);

  await page.goto(`/menu/profile/${otherUser.id}`);
  
  // Profile screen has testID - use that instead of text-based locator
  // Note: ProfileScreen doesn't have a testID on the header, so check for content or wait for loading to complete
  await expect(page.getByTestId('profile-content').or(page.locator('text=' + otherUser.userName).first())).toBeVisible({ timeout: 10000 });
});

test('should show friend status', async ({ page }) => {
  // Set up explicit data: another user's profile
  const otherUser = createMockUser({ userName: 'otheruser' });
  mockStore.setUser(otherUser);

  await page.goto(`/menu/profile/${otherUser.id}`);
  
  // Friend status section header or add friend button should be visible
  // When not friends, shows "You aren't friends" section header
  await expect(
    page.getByTestId('section-header-not-friends').or(page.getByTestId('button-add-friend'))
  ).toBeVisible({ timeout: 10000 });
});

test('should allow sending friend request', async ({ page }) => {
  // Set up explicit data: another user's profile (not a friend)
  const otherUser = createMockUser({ userName: 'otheruser' });
  mockStore.setUser(otherUser);

  await page.goto(`/menu/profile/${otherUser.id}`);
  

  // Add friend button should be visible - use testID
  const requestButton = page.getByTestId('button-add-friend');
  await expect(requestButton).toBeVisible({ timeout: 10000 });
  await requestButton.click();
  // Success message appears in snackbar - use testID
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
});
