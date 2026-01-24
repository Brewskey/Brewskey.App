import { test, expect } from '../../fixtures/test-fixtures';
import { mockBeverageWithPours } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should show pour history', async ({ page }) => {
  // Set up explicit data: one beverage with 5 pours
  const { beverage, pours } = await mockBeverageWithPours(page, 5);

  await page.goto(`/beverages/${beverage.id}`);
  

  // Check for the "Pour History" section header using testID
  await expect(page.getByTestId('section-header-pour-history')).toBeVisible();
  
  // Verify that pour items are displayed (at least one pour should be visible)
  await expect(page.getByTestId(`pour-item-${pours[0].id}`)).toBeVisible();
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
