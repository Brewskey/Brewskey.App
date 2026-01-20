import { test, expect } from '../../fixtures/test-fixtures';
import { mockBeverageWithPours } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to edit beverage', async ({ page }) => {
  // Set up explicit data: one beverage
  const { beverage } = await mockBeverageWithPours(page, 0);

  await page.goto(`/beverages/${beverage.id}/edit`);

  await expect(page).toHaveURL(/.*beverage.*edit|edit.*beverage/i);
  await expect(page.getByTestId('input-name')).toBeVisible();
});

test('should pre-fill form with existing data', async ({ page }) => {
  // Set up explicit data: one beverage
  const { beverage } = await mockBeverageWithPours(page, 0);

  await page.goto(`/beverages/${beverage.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  await expect(page.getByTestId('input-name')).toHaveValue(beverage.name);
});

test('should successfully update beverage', async ({ page }) => {
  // Set up explicit data: one beverage
  const { beverage } = await mockBeverageWithPours(page, 0);

  await page.goto(`/beverages/${beverage.id}/edit`);
  await expect(page.getByTestId('input-name')).toBeVisible();

  await page.getByTestId('input-name').fill('Updated Beverage Name');
  await expect(page.getByTestId('submit-button-edit-beverage')).toBeVisible();
  await page.getByTestId('submit-button-edit-beverage').click();

  // Success messages are dynamic content from API responses (SnackBar), so text-based locator is acceptable
  await expect(
    page.locator('text=/success|created|saved|updated/i'),
  ).toBeVisible();
});
