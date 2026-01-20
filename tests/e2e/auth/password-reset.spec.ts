import { test, expect } from '../../fixtures/test-fixtures';

test('should display password reset screen', async ({ page }) => {
  // Set up explicit data: no user (password reset screen)
  await page.goto('/resetPassword');

  await expect(page).toHaveURL(/.*reset|forgot/i);
  await expect(page.getByTestId('input-email')).toBeVisible();
});

test('should send password reset request', async ({ page }) => {
  // Set up explicit data: valid email format
  await page.goto('/resetPassword');
  await expect(page.getByTestId('input-email')).toBeVisible();

  await page.getByTestId('input-email').fill('test@example.com');
  await expect(page.getByTestId('button-reset-password')).toBeVisible();
  await page.getByTestId('button-reset-password').click();

  // Success modal shows "Email sent!" - use specific text to avoid strict mode violation
  await expect(page.getByText('Email sent!')).toBeVisible();
});

test('should show error for invalid email', async ({ page }) => {
  // Set up explicit data: invalid email format
  await page.goto('/resetPassword');
  await expect(page.getByTestId('input-email')).toBeVisible();

  await page.getByTestId('input-email').fill('invalid-email');
  await expect(page.getByTestId('button-reset-password')).toBeVisible();
  await page.getByTestId('button-reset-password').click();

  // Validation error messages - use testID when available, fallback to text-based locator
  await expect(
    page.getByTestId('reset-password-error-message').or(
      page.locator('text=/error|failed|required|must.*fill|invalid|try.*again|email.*not.*valid/i')
    ),
  ).toBeVisible();
});

test('should handle non-existent email gracefully', async ({ page }) => {
  // Set up explicit data: email doesn't exist (but valid format)
  await page.goto('/resetPassword');
  await expect(page.getByTestId('input-email')).toBeVisible();

  await page.getByTestId('input-email').fill('nonexistent@example.com');
  await expect(page.getByTestId('button-reset-password')).toBeVisible();
  await page.getByTestId('button-reset-password').click();

  // Should still show success message (security best practice) - use specific text
  await expect(page.getByText('Email sent!')).toBeVisible();
});
