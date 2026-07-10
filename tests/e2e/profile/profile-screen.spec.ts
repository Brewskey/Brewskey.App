import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should show friend status', async ({ page, seedApi }) => {
  // Another real user's profile
  const otherUser = await seedApi.registerOtherUser({ userName: 'otheruser' });

  await page.goto(`/profile/${otherUser.id}`);

  // Wait for profile content to load (hydrate + auth + API)
  await expect(page.getByTestId('profile-content')).toBeVisible({
    timeout: 15000,
  });

  // Friend status section header or add friend button should be visible
  // When not friends, shows "You aren't friends" section header or add friend button
  const notFriendsHeader = page.getByTestId('section-header-not-friends');
  const addFriendButton = page.getByTestId('button-add-friend');
  await expect(notFriendsHeader.or(addFriendButton).first()).toBeVisible();
});

test('should allow sending friend request', async ({ page, seedApi }) => {
  // Another real user's profile (not a friend)
  const otherUser = await seedApi.registerOtherUser({ userName: 'otheruser' });

  await page.goto(`/profile/${otherUser.id}`);

  // Add friend: open modal, confirm, then expect snackbar
  await expect(page.getByTestId('profile-content')).toBeVisible({
    timeout: 15000,
  });
  await page.getByTestId('button-add-friend').click();
  await page.getByRole('button', { name: 'yes' }).click();
  await expect(page.getByTestId('snackbar-message')).toBeVisible({
    timeout: 5000,
  });
});
