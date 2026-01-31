import { test, expect } from '../../fixtures/test-fixtures';
import { createMockUser } from '../../fixtures/test-data';
import { mockStore } from '../../fixtures/api-mocks';

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

test('should handle duplicate email error', async ({ page, mockStore }) => {
  // Set up explicit data: user with this email already exists
  const existingUser = createMockUser({
    email: 'existing@example.com',
    userName: 'existinguser',
  });
  mockStore.setUser(existingUser);

  await page.goto('/register');
  await expect(page.getByTestId('input-email')).toBeVisible();

  await page.getByTestId('input-userName').fill('newuser');
  await page.getByTestId('input-email').fill('existing@example.com');
  await page.getByTestId('input-password').fill('password123');
  await expect(page.getByTestId('register-submit-button')).toBeVisible();
  await page.getByTestId('register-submit-button').click();

  // Error messages from API responses - use testID
  await expect(page.getByTestId('register-error-message')).toBeVisible();
});
