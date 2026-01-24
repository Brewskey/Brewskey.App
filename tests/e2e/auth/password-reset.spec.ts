import { test, expect } from '../../fixtures/test-fixtures';

test('should display password reset screen', async ({ page }) => {
  // Set up explicit data: no user (password reset screen)
  await page.goto('/reset-password');

  await expect(page).toHaveURL(/.*reset|forgot/i);
  await expect(page.getByTestId('input-email')).toBeVisible();
});

test('should send password reset request', async ({ page }) => {
  // Set up explicit data: valid email format
  await page.goto('/reset-password');
  await expect(page.getByTestId('input-email')).toBeVisible();

  await page.getByTestId('input-email').fill('test@example.com');
  await expect(page.getByTestId('button-reset-password')).toBeVisible();
  await page.getByTestId('button-reset-password').click();

  // Success modal should appear - use testID
  await expect(page.getByTestId('reset-password-success-modal')).toBeVisible();
  await expect(page.getByTestId('reset-password-success-title')).toBeVisible();

  // Close the modal and verify it closed
  await page.getByTestId('button-reset-password-success-ok').click();
  await expect(page.getByTestId('reset-password-success-modal')).not.toBeVisible();
});

test('should show error for invalid email', async ({ page }) => {
  // Set up explicit data: invalid email format
  await page.goto('/reset-password');
  await expect(page.getByTestId('input-email')).toBeVisible();

  await page.getByTestId('input-email').fill('invalid-email');
  await expect(page.getByTestId('button-reset-password')).toBeVisible();
  await page.getByTestId('button-reset-password').click();

  // Validation error messages - field-level error testID
  await expect(page.getByTestId('form-validation-error-email')).toBeVisible();
});

test('should handle non-existent email gracefully', async ({ page }) => {
  // Set up explicit data: email doesn't exist (but valid format)
  await page.goto('/reset-password');
  await expect(page.getByTestId('input-email')).toBeVisible();

  await page.getByTestId('input-email').fill('nonexistent@example.com');
  await expect(page.getByTestId('button-reset-password')).toBeVisible();
  await page.getByTestId('button-reset-password').click();

  // Should still show success message (security best practice) - use testID
  await expect(page.getByTestId('reset-password-success-modal')).toBeVisible();
  await expect(page.getByTestId('reset-password-success-title')).toBeVisible();
});
