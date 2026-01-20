import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should display my profile screen', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/profile/me');
  

  await expect(page).toHaveURL(/.*profile.*me|my.*profile/i);
  // Profile text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/my.*profile|profile/i'),
  ).toBeVisible();
});

test('should show avatar picker', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/profile/me');
  

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
  await page.goto('/profile/me');
  

  // Password form inputs should be visible
  const passwordInput = page.getByTestId('input-oldPassword').or(page.getByTestId('input-newPassword'));
  await expect(passwordInput.first()).toBeVisible();
});
