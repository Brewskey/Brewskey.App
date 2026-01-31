import { test, expect } from '../../fixtures/test-fixtures';
import { mockBeverageWithPours } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to beverage details', async ({
  page,
  menuPage,
  authenticatedUser,
}) => {
  // Set up explicit data: one beverage created by the authenticated user
  const { beverage } = await mockBeverageWithPours(
    page,
    0,
    authenticatedUser?.user.id,
    authenticatedUser?.user.userName,
  );

  // Navigate through menu to beverages
  await menuPage.goto();
  await menuPage.clickBeverages();

  // Wait for beverages list to be visible
  await expect(page.getByTestId('beverages-list')).toBeVisible();

  // Beverage item has testID - use that instead of text-based locator
  await page.getByTestId(`beverage-item-${beverage.id}`).click();

  await expect(page).toHaveURL(/.*beverage.*details|beverage.*\d+/i);
});

test('should navigate to create beverage', async ({ page, menuPage }) => {
  // Navigate through menu to beverages
  await menuPage.goto();
  await menuPage.clickBeverages();

  // Wait for page to load
  await expect(page.getByTestId('beverages-list')).toBeVisible();

  // Click the add button using testID
  await page.getByTestId('header-add-button').click();

  // After clicking add, should navigate to new beverage screen
  // The URL might be "/beverages/new" or stay on "/menu/beverages" depending on navigation
  // Check for the form input instead
  await expect(page.getByTestId('input-name')).toBeVisible();
});
