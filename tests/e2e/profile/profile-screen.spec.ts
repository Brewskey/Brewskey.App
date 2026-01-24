import { test, expect } from '../../fixtures/test-fixtures';
import { createMockUser } from '../../fixtures/test-data';
import { mockStore } from '../../fixtures/api-mocks';

test.use({ autoAuthenticate: true });

test('should show friend status', async ({ page }) => {
  // Set up explicit data: another user's profile
  const otherUser = createMockUser({ userName: 'otheruser' });
  mockStore.setUser(otherUser);

  await page.goto(`/menu/profile/${otherUser.id}`);
  
  // Wait for profile content to load
  await expect(page.getByTestId('profile-content')).toBeVisible();
  
  // Friend status section header or add friend button should be visible
  // When not friends, shows "You aren't friends" section header or add friend button
  const notFriendsHeader = page.getByTestId('section-header-not-friends');
  const addFriendButton = page.getByTestId('button-add-friend');
  // At least one should be visible
  await expect(notFriendsHeader.or(addFriendButton)).toBeVisible();
});

test('should allow sending friend request', async ({ page }) => {
  // Set up explicit data: another user's profile (not a friend)
  const otherUser = createMockUser({ userName: 'otheruser' });
  mockStore.setUser(otherUser);

  await page.goto(`/menu/profile/${otherUser.id}`);
  

  // Add friend button should be visible - use testID
  // Playwright's auto-waiting will handle timing
  const requestButton = page.getByTestId('button-add-friend');
  await expect(requestButton).toBeVisible();
  await requestButton.click();
  // Success message appears in snackbar - use testID
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
});
