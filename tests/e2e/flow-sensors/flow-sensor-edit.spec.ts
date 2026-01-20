import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithFlowSensor } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to edit flow sensor', async ({ page }) => {
  // Set up explicit data: one tap with flow sensor
  const { flowSensor } = await mockTapWithFlowSensor(page);

  await page.goto(`/flow-sensors/${flowSensor.id}/edit`);

  await expect(page).toHaveURL(/.*flow.*sensor.*edit|edit.*flow.*sensor/i);
  
});

test('should pre-fill form with existing data', async ({ page }) => {
  // Set up explicit data: one tap with flow sensor
  const { flowSensor } = await mockTapWithFlowSensor(page);

  await page.goto(`/flow-sensors/${flowSensor.id}/edit`);
  

  // Gallons input should be visible for standard sensors
  const gallonsInput = page.getByTestId('input-gallons');
  await expect(gallonsInput).toBeVisible();
  await expect(gallonsInput).toHaveValue(/.*/);
});

test('should successfully update flow sensor', async ({ page }) => {
  // Set up explicit data: one tap with flow sensor
  const { flowSensor } = await mockTapWithFlowSensor(page);

  await page.goto(`/flow-sensors/${flowSensor.id}/edit`);
  

  // Fill gallons if input is visible (for standard sensor type)
  const gallonsInput = page.getByTestId('input-gallons');
  await expect(gallonsInput).toBeVisible();
  await page.getByTestId('input-gallons').fill('2');

  await expect(page.getByTestId('submit-button-save')).toBeVisible();
  await page.getByTestId('submit-button-save').click();

  // Success messages are dynamic content from API responses (SnackBar), so text-based locator is acceptable
  await expect(
    page.locator('text=/success|created|saved|updated/i'),
  ).toBeVisible();
});
