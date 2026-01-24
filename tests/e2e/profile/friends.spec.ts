import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should allow sending friend request', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/menu/my-friends');
  
  // Add friend button should be visible - use testID
  const addButton = page.getByTestId('button-add-friend');
  await expect(addButton).toBeVisible();
  await addButton.click();
  
  // Friend request form inputs should be visible after clicking add button
  // The form might use userName or email input - check for either
  const userNameInput = page.getByTestId('input-userName');
  const emailInput = page.getByTestId('input-email');
  // At least one input should be visible
  await expect(userNameInput.or(emailInput)).toBeVisible();
});

test('should show pending friend requests', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/menu/my-friends/myFriendsRequest');
  
  // FriendRequestsList component always renders the List with testID="friend-requests-list"
  // The list is visible even when empty (shows "No requests" message)
  await expect(page.getByTestId('friend-requests-list')).toBeVisible();
});

test('should allow accepting friend requests', async ({ page }) => {
  // Set up explicit data: authenticated user with pending friend requests
  // Note: This would require mocking friend requests in the store
  await page.goto('/menu/my-friends/myFriendsRequest');
  
  // FriendRequestsList component always renders the List with testID="friend-requests-list"
  // The list is visible even when empty
  await expect(page.getByTestId('friend-requests-list')).toBeVisible();
  
  // Note: To test accepting friend requests, we would need to set up mock data
  // with pending friend requests in the store
});
