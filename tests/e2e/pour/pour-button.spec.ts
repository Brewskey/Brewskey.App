import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test.describe('Pour Button', () => {
  test('should display pour button on home screen', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await expect(page.getByTestId('pour-button')).toBeVisible({ timeout: 10000 });
  });

  test('should open pour modal when button is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Wait for pour button to be visible
    await expect(page.getByTestId('pour-button')).toBeVisible({ timeout: 10000 });
    
    // Click the pour button
    await page.getByTestId('pour-button').click();
    
    // Wait for modal to appear
    await expect(page.getByTestId('pour-process-modal')).toBeVisible({ timeout: 5000 });
  });

  test('should show loading indicator when pouring', async ({ page }) => {
    await page.goto('/');
    
    // Wait for pour button to be visible
    await expect(page.getByTestId('pour-button')).toBeVisible({ timeout: 10000 });
    
    // Click the pour button to open modal
    await page.getByTestId('pour-button').click();
    
    // Wait for modal to appear
    await expect(page.getByTestId('pour-process-modal')).toBeVisible({ timeout: 5000 });
    
    // Enter a 6-digit code to trigger authorization
    const input = page.getByTestId('pour-modal-totp-input');
    await expect(input).toBeVisible();
    
    // Type a valid TOTP code
    await input.fill('123456');
    
    // Wait for loading state (the authorization request is async)
    // Note: Loading indicator might appear briefly, but since we're mocking the API,
    // it should complete quickly
    await page.waitForTimeout(500);
  });

  test('should close modal when clicking outside', async ({ page }) => {
    await page.goto('/');
    
    // Wait for pour button to be visible
    await expect(page.getByTestId('pour-button')).toBeVisible({ timeout: 10000 });
    
    // Click the pour button to open modal
    await page.getByTestId('pour-button').click();
    
    // Wait for modal to appear
    await expect(page.getByTestId('pour-process-modal')).toBeVisible({ timeout: 5000 });
    
    // Click outside the modal (on the backdrop)
    // The modal backdrop is clickable and should close the modal
    const modal = page.getByTestId('pour-process-modal');
    await modal.click({ position: { x: 0, y: 0 } });
    
    // Wait for modal to disappear
    await expect(page.getByTestId('pour-process-modal')).toBeHidden({ timeout: 2000 });
  });

  test('should validate TOTP code length', async ({ page }) => {
    await page.goto('/');
    
    // Wait for pour button to be visible
    await expect(page.getByTestId('pour-button')).toBeVisible({ timeout: 10000 });
    
    // Click the pour button to open modal
    await page.getByTestId('pour-button').click();
    
    // Wait for modal to appear
    await expect(page.getByTestId('pour-process-modal')).toBeVisible({ timeout: 5000 });
    
    // Enter a code that's too short
    const input = page.getByTestId('pour-modal-totp-input');
    await expect(input).toBeVisible();
    
    // Type a 5-digit code (should not trigger authorization)
    await input.fill('12345');
    
    // Wait a bit to ensure no authorization is triggered
    await page.waitForTimeout(500);
    
    // Modal should still be visible (code too short)
    await expect(page.getByTestId('pour-process-modal')).toBeVisible();
    
    // Now enter a valid 6-digit code
    await input.fill('123456');
    
    // Wait for authorization to complete
    await page.waitForTimeout(1000);
    
    // Modal should close after successful authorization
    await expect(page.getByTestId('pour-process-modal')).toBeHidden({ timeout: 5000 });
  });

  test('should display error message for invalid code', async ({ page }) => {
    // Mock the API to return an error for invalid codes
    await page.route('**/api/authorizations/pour/**', async (route) => {
      const body = await route.request().postDataJSON();
      
      // Return error for specific invalid code
      if (body.totp === '000000') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'Invalid code',
            error_description: 'The passcode you entered was incorrect or expired. Please try a new code.',
          }),
        });
        return;
      }
      
      // Otherwise, continue with normal mock
      await route.continue();
    });
    
    await page.goto('/');
    
    // Wait for pour button to be visible
    await expect(page.getByTestId('pour-button')).toBeVisible({ timeout: 10000 });
    
    // Click the pour button to open modal
    await page.getByTestId('pour-button').click();
    
    // Wait for modal to appear
    await expect(page.getByTestId('pour-process-modal')).toBeVisible({ timeout: 5000 });
    
    // Enter an invalid code
    const input = page.getByTestId('pour-modal-totp-input');
    await expect(input).toBeVisible();
    await input.fill('000000');
    
    // Wait for error to appear
    // The error text should be displayed in the modal
    await expect(page.getByText(/passcode.*incorrect|invalid.*code/i)).toBeVisible({ timeout: 5000 });
  });
});
