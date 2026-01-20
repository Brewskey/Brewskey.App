import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to create device form', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/devices/new');

  await expect(page).toHaveURL(/.*device.*new|new.*device/i);
  await expect(page.getByTestId('input-name')).toBeVisible();
});

test('should validate required fields', async ({ page }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/devices/new');
  await expect(page.getByTestId('input-name')).toBeVisible();

  await expect(page.getByTestId('submit-button-create-device')).toBeVisible();
  await page.getByTestId('submit-button-create-device').click();

  // Validation messages use testID when available, fallback to text-based locator
  await expect(
    page.locator('text=/error|failed|required|must.*fill|invalid|try.*again/i'),
  ).toBeVisible();
});

test('should successfully create device', async ({ page, devicePage }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await page.goto('/devices/new');
  await expect(page.getByTestId('input-name')).toBeVisible();
  
  await devicePage.fillDeviceForm({
    name: 'New Device',
    particleId: 'particle_12345',
  });
  await devicePage.submitForm();

  // Success messages are dynamic content from API responses (SnackBar), so text-based locator is acceptable
  await expect(
    page.locator('text=/success|created|saved|updated/i'),
  ).toBeVisible();
});
