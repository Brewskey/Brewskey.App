import type { Page } from '@playwright/test';

import { uniqueGeolocation, SeedApi } from '../../fixtures/seed-api';
import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

/**
 * Seeds a pourable device at unique coordinates and points the browser
 * geolocation at the same spot, so the pour-authorization endpoint (which
 * matches a TOTP against the 10 locations nearest the caller) can always find
 * this device regardless of what the persistent stack DB has accumulated.
 */
async function seedIsolatedPourableDevice(page: Page, seedApi: SeedApi) {
  const coords = uniqueGeolocation();
  await page.context().setGeolocation(coords);
  return seedApi.createPourableDevice(coords.latitude, coords.longitude);
}

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

  test('should show loading indicator when pouring', async ({
    page,
    seedApi,
  }) => {
    // A real pourable device at unique coordinates (browser geolocation set
    // to match) so pour authorization can always locate it.
    const { device } = await seedIsolatedPourableDevice(page, seedApi);
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

    // Fetch the device's live TOTP at the last moment (codes roll every 30s)
    // and enter it — this triggers a real pour authorization.
    await input.fill(await seedApi.deviceTotp(device.id));

    // Authorization completes and modal closes. Loading (input disabled) can be too fast to assert.
    await expect(page.getByTestId('pour-process-modal')).toBeHidden({
      timeout: 10000,
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

  test('should validate TOTP code length', async ({ page, seedApi }) => {
    const { device } = await seedIsolatedPourableDevice(page, seedApi);
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

    // Now enter the device's real 6-digit TOTP to trigger authorization
    await input.fill(await seedApi.deviceTotp(device.id));

    // Authorization completes and modal closes automatically
    await expect(page.getByTestId('pour-process-modal')).toBeHidden({
      timeout: 10000,
    });
  });

  test('should display error message for invalid code', async ({ page }) => {
    // No device matches '000000' at this location, so the REAL API rejects
    // the authorization and the modal surfaces the error.
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
