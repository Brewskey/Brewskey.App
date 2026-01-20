import { test, expect } from '../../fixtures/test-fixtures';
import { mockLocationWithTaps } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to edit location', async ({ page }) => {
  // Set up explicit data: one location
  const { location } = await mockLocationWithTaps(page, 0);

  await page.goto(`/locations/${location.id}/edit`);

  await expect(page).toHaveURL(/.*location.*edit|edit.*location/i);
  await expect(page.getByTestId('input-name')).toBeVisible();
});

test('should pre-fill form with existing data', async ({ page }) => {
  // Set up explicit data: one location
  const { location } = await mockLocationWithTaps(page, 0);

  await page.goto(`/locations/${location.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  await expect(page.getByTestId('input-name')).toHaveValue(location.name);
});

test('should successfully update location', async ({ page }) => {
  // Set up explicit data: one location
  const { location } = await mockLocationWithTaps(page, 0);

  await page.goto(`/locations/${location.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  await page.getByTestId('input-name').fill('Updated Location Name');
  await expect(page.getByTestId('submit-button-edit-location')).toBeVisible();
  await page.getByTestId('submit-button-edit-location').click();

  // Success messages are dynamic content from API responses (SnackBar), so text-based locator is acceptable
  await expect(
    page.locator('text=/success|created|saved|updated/i'),
  ).toBeVisible();
});
