import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to custom flow sensor creation', async ({ page }) => {
  // Set up explicit data: one tap
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/flow-sensors/new/custom`);

  await expect(page).toHaveURL(/.*custom/i);
  
});

test('should allow custom calibration input', async ({ page }) => {
  // Set up explicit data: one tap
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/flow-sensors/new/custom`);
  

  // Calibration input should be visible for custom sensors
  const calibrationInput = page.getByTestId('input-calibration').or(page.getByTestId('input-gallons'));
  await expect(calibrationInput.first()).toBeVisible();
  await calibrationInput.first().fill('1.5');
});

test('should successfully create custom flow sensor', async ({ page }) => {
  // Set up explicit data: one tap
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/flow-sensors/new/custom`);
  

  // Fill calibration input if visible
  const calibrationInput = page.getByTestId('input-calibration').or(page.getByTestId('input-gallons'));
  await expect(calibrationInput.first()).toBeVisible();
  await calibrationInput.first().fill('1.5');

  await expect(page.getByTestId('submit-button-save')).toBeVisible();
  await page.getByTestId('submit-button-save').click();

  // Success messages are dynamic content from API responses (SnackBar), so text-based locator is acceptable
  await expect(
    page.locator('text=/success|created|saved|updated/i'),
  ).toBeVisible();
});
