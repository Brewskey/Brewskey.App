import { test, expect } from '../../fixtures/test-fixtures';
import { mockBeverageWithPours } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display beverage information', async ({ page }) => {
  // Set up explicit data: one beverage with no pours
  const { beverage } = await mockBeverageWithPours(page, 0);

  await page.goto(`/beverages/${beverage.id}`);
  

  // Beverage name is dynamic content (user-generated), so text-based locator is acceptable
  await expect(page.locator(`text=${beverage.name}`)).toBeVisible();
});

test('should show pour history', async ({ page }) => {
  // Set up explicit data: one beverage with 5 pours
  const { beverage, pours } = await mockBeverageWithPours(page, 5);

  await page.goto(`/beverages/${beverage.id}`);
  

  // Pour history text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/pour.*history|recent.*pours/i'),
  ).toBeVisible();
});

test('should navigate to edit beverage', async ({ page }) => {
  // Set up explicit data: one beverage (edit button should be visible for owned beverages)
  const { beverage } = await mockBeverageWithPours(page, 0);

  await page.goto(`/beverages/${beverage.id}`);
  

  // Use testID if available, otherwise use role-based locator for edit button
  // Edit button should be visible for beverages created by the authenticated user
  const editButton = page.getByTestId('button-edit-beverage').or(
    page.getByRole('button', { name: /edit/i })
  );
  await expect(editButton).toBeVisible();
  await editButton.click();
  
  await expect(page).toHaveURL(/.*edit/i);
});
