import { test, expect } from '../../fixtures/test-fixtures';
import { ROUTES } from '../../fixtures/routes';

test.use({ autoAuthenticate: true });

test('should display my profile screen', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto(ROUTES.MENU_MY_PROFILE);

  await expect(page).toHaveURL(/.*my.*profile/i);
  // My profile screen has testID - use that instead of text-based locator
  await expect(page.getByTestId('header-my-profile')).toBeVisible();
  await expect(page.getByTestId('my-profile-content')).toBeVisible();
});

test('should show avatar picker', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto(ROUTES.MENU_MY_PROFILE);

  // Avatar picker - use testID if available, otherwise role-based or type-based locator
  const avatarPicker = page
    .getByTestId('avatar-picker')
    .or(
      page
        .locator('input[type="file"]')
        .or(page.getByRole('button', { name: /change/i })),
    );
  await expect(avatarPicker.first()).toBeVisible();
});

test('should show change password form', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto(ROUTES.MENU_MY_PROFILE);

  // Password form inputs should be visible
  const passwordInput = page
    .getByTestId('input-oldPassword')
    .or(page.getByTestId('input-newPassword'));
  await expect(passwordInput.first()).toBeVisible();
});
