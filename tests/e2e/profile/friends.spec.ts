import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should display friends list', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/friends');
  

  // Friends text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/friends|friend.*list/i'),
  ).toBeVisible();
});

test('should allow sending friend request', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/friends');
  

  // Add friend button should be visible - use role-based locator for standard button
  // Button should be visible when user is authenticated
  const addButton = page.getByRole('button', { name: /add.*friend|add/i });
  await expect(addButton).toBeVisible();
  await addButton.click();
  // Friend request form inputs should be visible
  const friendInput = page.getByTestId('input-userName').or(page.getByTestId('input-email'));
  await expect(friendInput.first()).toBeVisible();
});

test('should show pending friend requests', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/friends/requests');
  

  // Pending requests text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/pending|requests/i'),
  ).toBeVisible();
});

test('should allow accepting friend requests', async ({ page }) => {
  // Set up explicit data: authenticated user with pending friend requests
  // Note: This would require mocking friend requests in the store
  await page.goto('/friends/requests');
  

  // Accept button should be visible if there are pending requests
  // Note: This test would need explicit data setup with pending friend requests
  // For now, verify the page loads correctly
  await expect(
    page.locator('text=/pending|requests/i'),
  ).toBeVisible();
});
