import { test, expect } from '../../fixtures/test-fixtures';
import { createMockUser } from '../../fixtures/test-data';
import { mockStore } from '../../fixtures/api-mocks';

test('should display login screen', async ({ page, loginPage }) => {
  await loginPage.goto();

  await expect(page).toHaveURL(/.*login/);
  await expect(page.getByTestId('login-username-input')).toBeVisible();
  await expect(page.getByTestId('login-password-input')).toBeVisible();
  await expect(page.getByTestId('login-submit-button')).toBeVisible();
});

test('should successfully login with valid credentials', async ({ page, loginPage }) => {
  // Set up explicit data: user exists in mock store (but NOT authenticated in localStorage)
  // This allows the login flow to work properly
  const user = createMockUser({
    userName: 'testuser',
  });
  mockStore.setUser(user);
  
  await loginPage.goto();
  await loginPage.login('testuser', 'password123');

  // Wait for navigation - after login, should redirect to home (default tab)
  // The URL might be "/" or "/home" depending on React Navigation routing
  await expect(page).toHaveURL(/.*home|\/$/);
});

test('should show error with invalid credentials', async ({ page, loginPage }) => {
  // Set up explicit data: no user exists (empty store)
  // Store is already empty from resetStores fixture
  await loginPage.goto();
  await loginPage.login('invaliduser', 'wrongpassword');

  // Should show error message - use testID
  await expect(page.getByTestId('login-error-message')).toBeVisible();
});

test('should navigate to register screen', async ({ page, loginPage }) => {
  await loginPage.goto();
  await loginPage.clickRegister();

  await expect(page).toHaveURL(/.*register/);
});

test('should navigate to password reset screen', async ({ page, loginPage }) => {
  await loginPage.goto();
  await loginPage.clickForgotPassword();

  await expect(page).toHaveURL(/.*reset|forgot/i);
});

test('should persist session on page reload', async ({ page, loginPage }) => {
  // Set up explicit data: user exists in mock store (but NOT authenticated in localStorage initially)
  const user = createMockUser({
    userName: 'testuser',
  });
  mockStore.setUser(user);
  
  await loginPage.goto();
  await loginPage.login('testuser', 'password123');

  // Wait for navigation after login
  await expect(page).toHaveURL(/.*home|\/$/);

  // Reload page
  await page.reload();

  // Should still be logged in (session persisted in localStorage after login)
  // After reload, should still be on home or root
  await expect(page).toHaveURL(/.*home|\/$/);
});
