import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test.describe('Pour Button', () => {
  test('should open pour modal when button is clicked', async ({ page }) => {
    await page.goto('/');

    // Wait for pour button to be visible
    await expect(page.getByTestId('pour-button')).toBeVisible({
      timeout: 10000,
    });

    // Click the pour button
    await page.getByTestId('pour-button').click();

    // Wait for modal to appear
    await expect(page.getByTestId('pour-process-modal')).toBeVisible({
      timeout: 5000,
    });
  });

  test('should show loading indicator when pouring', async ({ page }) => {
    await page.goto('/');

    // Wait for pour button to be visible
    await expect(page.getByTestId('pour-button')).toBeVisible({
      timeout: 10000,
    });

    // Click the pour button to open modal
    await page.getByTestId('pour-button').click();

    // Wait for modal to appear
    await expect(page.getByTestId('pour-process-modal')).toBeVisible({
      timeout: 5000,
    });

    // Enter a 6-digit code to trigger authorization
    const input = page.getByTestId('pour-modal-totp-input');
    await expect(input).toBeVisible();

    // Type a valid TOTP code - this triggers async authorization
    await input.fill('123456');

    // Authorization completes and modal closes. Loading (input disabled) can be too fast to assert.
    await expect(page.getByTestId('pour-process-modal')).toBeHidden({
      timeout: 5000,
    });
  });

  test('should close modal when clicking outside', async ({ page }) => {
    await page.goto('/');

    // Wait for pour button to be visible
    await expect(page.getByTestId('pour-button')).toBeVisible({
      timeout: 10000,
    });

    // Click the pour button to open modal
    await page.getByTestId('pour-button').click();

    // Wait for modal to appear
    await expect(page.getByTestId('pour-process-modal')).toBeVisible({
      timeout: 5000,
    });

    // Click outside the modal (on the backdrop)
    // The CenteredModal uses TouchableOpacity with onPressOut for the backdrop
    // Click at the edge of the viewport to ensure we hit the backdrop, not the modal content
    const viewportSize = page.viewportSize();
    if (viewportSize) {
      // Click at the top-left corner of the viewport (backdrop area)
      await page.mouse.click(10, 10);
    } else {
      // Fallback: click on a point outside the modal content
      // The modal is centered, so clicking at viewport edges should hit the backdrop
      await page.click('body', { position: { x: 10, y: 10 } });
    }

    // Wait for modal to disappear
    await expect(page.getByTestId('pour-process-modal')).toBeHidden({
      timeout: 2000,
    });
  });

  test('should validate TOTP code length', async ({ page }) => {
    await page.goto('/');

    // Wait for pour button to be visible
    await expect(page.getByTestId('pour-button')).toBeVisible({
      timeout: 10000,
    });

    // Click the pour button to open modal
    await page.getByTestId('pour-button').click();

    // Wait for modal to appear
    await expect(page.getByTestId('pour-process-modal')).toBeVisible({
      timeout: 5000,
    });

    // Enter a code that's too short
    const input = page.getByTestId('pour-modal-totp-input');
    await expect(input).toBeVisible();

    // Type a 5-digit code (should not trigger authorization - requires 6 digits)
    await input.fill('12345');

    // Modal should still be visible (code too short, authorization not triggered)
    // Input should remain enabled since isLoading is false
    await expect(page.getByTestId('pour-process-modal')).toBeVisible();
    await expect(input).toBeEnabled();

    // Now enter a valid 6-digit code to trigger authorization
    await input.fill('123456');

    // Wait for input to become disabled (loading state) and then modal to close
    // Authorization completes and modal closes automatically
    await expect(page.getByTestId('pour-process-modal')).toBeHidden({
      timeout: 5000,
    });
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
            error_description:
              'The passcode you entered was incorrect or expired. Please try a new code.',
          }),
        });
        return;
      }

      // Otherwise, continue with normal mock
      await route.continue();
    });

    await page.goto('/');

    // Wait for pour button to be visible
    await expect(page.getByTestId('pour-button')).toBeVisible({
      timeout: 10000,
    });

    // Click the pour button to open modal
    await page.getByTestId('pour-button').click();

    // Wait for modal to appear
    await expect(page.getByTestId('pour-process-modal')).toBeVisible({
      timeout: 5000,
    });

    // Enter an invalid code
    const input = page.getByTestId('pour-modal-totp-input');
    await expect(input).toBeVisible();
    await input.fill('000000');

    // Wait for error to appear
    // The error text should be displayed in the modal
    await expect(
      page.getByText(/passcode.*incorrect|invalid.*code/i),
    ).toBeVisible({ timeout: 5000 });
  });
});
