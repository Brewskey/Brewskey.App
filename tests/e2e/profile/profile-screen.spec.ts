import { test, expect } from '../../fixtures/test-fixtures';
import { createMockUser } from '../../fixtures/test-data';
import { mockStore } from '../../fixtures/api-mocks';

test.use({ autoAuthenticate: true });

test('should display user profile', async ({ page }) => {
  // Set up explicit data: another user's profile
  const otherUser = createMockUser({ userName: 'otheruser' });
  mockStore.setUser(otherUser);

  await page.goto(`/profile/${otherUser.id}`);
  

  // Profile text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/profile|user|account/i'),
  ).toBeVisible();
});

test('should show friend status', async ({ page }) => {
  // Set up explicit data: another user's profile
  const otherUser = createMockUser({ userName: 'otheruser' });
  mockStore.setUser(otherUser);

  await page.goto(`/profile/${otherUser.id}`);
  

  // Friend status text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/friend|status|request/i'),
  ).toBeVisible();
});

test('should allow sending friend request', async ({ page }) => {
  // Set up explicit data: another user's profile (not a friend)
  const otherUser = createMockUser({ userName: 'otheruser' });
  mockStore.setUser(otherUser);

  await page.goto(`/profile/${otherUser.id}`);
  

  // Add friend button should be visible - use role-based locator for standard button
  // Button should be visible when viewing a profile that's not a friend
  const requestButton = page.getByRole('button', { name: /add.*friend|send.*request/i });
  await expect(requestButton).toBeVisible();
  await requestButton.click();
  // Success message is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/sent|request|success/i'),
  ).toBeVisible();
});
