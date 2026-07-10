import { test, expect } from '../../fixtures/test-fixtures';



test('should display register screen', async ({ page }) => {
  // Set up explicit data: no user (register screen)
  await page.goto('/register');

  await expect(page).toHaveURL(/.*register/);
  await expect(page.getByTestId('input-email')).toBeVisible();
  await expect(page.getByTestId('input-password')).toBeVisible();
  await expect(page.getByTestId('input-userName')).toBeVisible();
});

test('should successfully register new user', async ({ page }) => {
  // Set up explicit data: no existing user with this email
  await page.goto('/register');
  await expect(page.getByTestId('input-email')).toBeVisible();

  await page.getByTestId('input-userName').fill('newuser');
  await page.getByTestId('input-email').fill('newuser@example.com');
  await page.getByTestId('input-password').fill('password123');
  await expect(page.getByTestId('register-submit-button')).toBeVisible();
  await page.getByTestId('register-submit-button').click();

  // After successful registration, it automatically logs in and redirects to home
  // The URL might be "/" or "/home" depending on React Navigation routing
  await expect(page).toHaveURL(/.*home|\/$/i);
});

test('should show validation error for invalid email', async ({ page }) => {
  // Set up explicit data: invalid email format
  await page.goto('/register');
  await expect(page.getByTestId('input-email')).toBeVisible();

  await page.getByTestId('input-userName').fill('newuser');
  await page.getByTestId('input-email').fill('invalid-email');
  await page.getByTestId('input-password').fill('password123');
  await expect(page.getByTestId('register-submit-button')).toBeVisible();
  await page.getByTestId('register-submit-button').click();

  // Validation error messages - field-level error testID
  await expect(page.getByTestId('form-validation-error-email')).toBeVisible();
});

test('should show validation error for weak password', async ({ page }) => {
  // Set up explicit data: password too short
  await page.goto('/register');
  await expect(page.getByTestId('input-email')).toBeVisible();

  await page.getByTestId('input-userName').fill('newuser');
  await page.getByTestId('input-email').fill('newuser@example.com');
  await page.getByTestId('input-password').fill('123');
  await expect(page.getByTestId('register-submit-button')).toBeVisible();
  await page.getByTestId('register-submit-button').click();

  // Validation error messages - field-level error testID
  await expect(
    page.getByTestId('form-validation-error-password'),
  ).toBeVisible();
});

test('should handle duplicate email error', async ({ page, seedUser }) => {
  // A real account with this email already exists
  const existing = await seedUser({ userName: 'existinguser' });

  await page.goto('/register');
  await expect(page.getByTestId('input-email')).toBeVisible();

  await page.getByTestId('input-userName').fill(`new${existing.userName}`);
  await page.getByTestId('input-email').fill(existing.email);
  await page.getByTestId('input-password').fill('password123');
  await expect(page.getByTestId('register-submit-button')).toBeVisible();
  await page.getByTestId('register-submit-button').click();

  // Error messages from API responses - use testID
  await expect(page.getByTestId('register-error-message')).toBeVisible();
});
