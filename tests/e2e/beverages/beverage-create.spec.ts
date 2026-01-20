import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to create beverage form', async ({ page, menuPage }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  // Navigate through menu to beverages, then click the add button
  await menuPage.goto();
  await menuPage.clickBeverages();
  
  // Click the add button in the header to navigate to new beverage screen
  await page.getByTestId('header-add-button').click();

  await expect(page.getByTestId('input-name')).toBeVisible();
});

test('should validate required fields', async ({ page, menuPage }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  // Navigate through menu to beverages, then click the add button
  await menuPage.goto();
  await menuPage.clickBeverages();
  await page.getByTestId('header-add-button').click();
  
  await expect(page.getByTestId('input-name')).toBeVisible();

  await expect(page.getByTestId('submit-button-create-beverage')).toBeVisible();
  await page.getByTestId('submit-button-create-beverage').click();

  // Validation messages are dynamic content - use testID when available, fallback to text-based locator
  await expect(
    page.locator('text=/error|failed|required|must.*fill|invalid|try.*again/i'),
  ).toBeVisible();
});

test('should successfully create beverage', async ({ page, menuPage }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  // Navigate through menu to beverages, then click the add button
  await menuPage.goto();
  await menuPage.clickBeverages();
  await page.getByTestId('header-add-button').click();
  
  await expect(page.getByTestId('input-name')).toBeVisible();

  await page.getByTestId('input-name').fill('New Beverage');
  await expect(page.getByTestId('submit-button-create-beverage')).toBeVisible();
  await page.getByTestId('submit-button-create-beverage').click();

  // Success messages are dynamic content from API responses (SnackBar), so text-based locator is acceptable
  await expect(
    page.locator('text=/success|created|saved|updated/i'),
  ).toBeVisible();
});
