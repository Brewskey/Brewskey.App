import { devices } from '@playwright/test';

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

test('should successfully login with valid credentials', async ({
  page,
  loginPage,
}) => {
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

test('should show error with invalid credentials', async ({
  page,
  loginPage,
}) => {
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

test('should navigate to password reset screen', async ({
  page,
  loginPage,
}) => {
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

test.describe('iOS-emulated login screen', () => {
  test.use({
    deviceScaleFactor: devices['iPhone 13'].deviceScaleFactor,
    hasTouch: devices['iPhone 13'].hasTouch,
    isMobile: devices['iPhone 13'].isMobile,
    userAgent: devices['iPhone 13'].userAgent,
    viewport: devices['iPhone 13'].viewport,
  });

  test('should render Apple login above Google login', async ({
    page,
    loginPage,
  }) => {
    await page.addInitScript(() => {
      (window as Window & {
        __BREWSKEY_E2E_APPLE_SIGN_IN_AVAILABLE__?: boolean;
      }).__BREWSKEY_E2E_APPLE_SIGN_IN_AVAILABLE__ = true;
    });

    await loginPage.goto();

    await expect(page.getByTestId('apple-login-button-container')).toBeVisible();
    await expect(page.getByTestId('google-login-button-container')).toBeVisible();

    const appleComesBeforeGoogle = await page.evaluate(() => {
      const apple = document.querySelector(
        '[data-testid="apple-login-button-container"]',
      );
      const google = document.querySelector(
        '[data-testid="google-login-button-container"]',
      );

      return Boolean(
        apple &&
          google &&
          (apple.compareDocumentPosition(google) &
            Node.DOCUMENT_POSITION_FOLLOWING),
      );
    });

    expect(appleComesBeforeGoogle).toBe(true);
  });
});
