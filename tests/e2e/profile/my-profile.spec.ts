import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should display my profile screen', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/menu/my-profile');
  

  await expect(page).toHaveURL(/.*my.*profile/i);
  // My profile screen has testID - use that instead of text-based locator
  await expect(page.getByTestId('header-my-profile')).toBeVisible();
  await expect(page.getByTestId('my-profile-content')).toBeVisible();
});

test('should show avatar picker', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/menu/my-profile');
  

  // Avatar picker - use testID if available, otherwise role-based or type-based locator
  const avatarPicker = page.getByTestId('avatar-picker').or(
    page.locator('input[type="file"]').or(
      page.getByRole('button', { name: /change/i })
    )
  );
  await expect(avatarPicker.first()).toBeVisible();
});

test('should show change password form', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/menu/my-profile');
  

  // Password form inputs should be visible
  const passwordInput = page.getByTestId('input-oldPassword').or(page.getByTestId('input-newPassword'));
  await expect(passwordInput.first()).toBeVisible();
});
