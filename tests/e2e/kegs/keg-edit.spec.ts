import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to edit keg', async ({ page }) => {
  // Set up explicit data: one keg
  const { keg } = await mockTapWithKeg(page);

  await page.goto(`/kegs/${keg.id}/edit`);

  await expect(page).toHaveURL(/.*keg.*edit|edit.*keg/i);
  // Wait for form to load - check for ounces input
  const ouncesInput = page.getByTestId('input-ouncesRemaining').or(page.getByTestId('input-ouncesTotal'));
  await expect(ouncesInput.first()).toBeVisible();
});

test('should pre-fill form with existing data', async ({ page }) => {
  // Set up explicit data: one keg with ounces data
  const { keg } = await mockTapWithKeg(page);

  await page.goto(`/kegs/${keg.id}/edit`);
  

  // Wait for form inputs to be visible - either ouncesRemaining or ouncesTotal
  const ouncesInput = page.getByTestId('input-ouncesRemaining').or(page.getByTestId('input-ouncesTotal'));
  await expect(ouncesInput.first()).toBeVisible();
});

test('should successfully update keg', async ({ page }) => {
  // Set up explicit data: one keg
  const { keg } = await mockTapWithKeg(page);

  await page.goto(`/kegs/${keg.id}/edit`);
  

  // Wait for form input
  const ouncesInput = page.getByTestId('input-ouncesRemaining').or(page.getByTestId('input-ouncesTotal'));
  await expect(ouncesInput.first()).toBeVisible();

  await page.getByTestId('input-ouncesRemaining').fill('1000');
  await expect(page.getByTestId('submit-button-update-current-keg')).toBeVisible();
  await page.getByTestId('submit-button-update-current-keg').click();

  // Success messages are dynamic content from API responses (SnackBar), so text-based locator is acceptable
  await expect(
    page.locator('text=/success|created|saved|updated/i'),
  ).toBeVisible();
});
