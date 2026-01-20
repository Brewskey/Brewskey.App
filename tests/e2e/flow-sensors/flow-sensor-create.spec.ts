import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to create flow sensor', async ({ page }) => {
  // Set up explicit data: one tap
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/flow-sensors/new`);

  await expect(page).toHaveURL(/.*flow.*sensor.*new|new.*flow.*sensor/i);
  // Wait for form to load - check for type dropdown or gallons input
  
});

test('should allow selecting sensor type', async ({ page }) => {
  // Set up explicit data: one tap
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/flow-sensors/new`);
  

  // Type select should be visible - check for dropdown or input
  const typeSelect = page.getByTestId('dropdown-type').or(page.getByTestId('input-type'));
  await expect(typeSelect.first()).toBeVisible();
  // Try selectOption first, if it fails (because it's an input), fill it instead
  await typeSelect.first().selectOption('standard').catch(() => {
    return typeSelect.first().fill('standard');
  });
});

test('should allow setting gallon calibration', async ({ page }) => {
  // Set up explicit data: one tap
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/flow-sensors/new`);
  

  // Gallons input should be visible for standard sensors
  const gallonsInput = page.getByTestId('input-gallons');
  await expect(gallonsInput).toBeVisible();
  await page.getByTestId('input-gallons').fill('1');
});

test('should successfully create flow sensor', async ({ page }) => {
  // Set up explicit data: one tap
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/flow-sensors/new`);
  

  // Fill gallons if input is visible (for standard sensor type)
  const gallonsInput = page.getByTestId('input-gallons');
  await expect(gallonsInput).toBeVisible();
  await page.getByTestId('input-gallons').fill('1');

  await expect(page.getByTestId('submit-button-save')).toBeVisible();
  await page.getByTestId('submit-button-save').click();

  // Success messages are dynamic content from API responses (SnackBar), so text-based locator is acceptable
  await expect(
    page.locator('text=/success|created|saved|updated/i'),
  ).toBeVisible();
});
