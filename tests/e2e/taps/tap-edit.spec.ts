import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to edit tap', async ({ page }) => {
  // Set up explicit data: one tap with keg
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/tap/${tap.id}/edit`);

  await expect(page).toHaveURL(/.*tap.*edit|edit.*tap/i);
  // Wait for header to be visible
  await expect(page.getByTestId('header-edit-tap')).toBeVisible();
});

test('should pre-fill form with existing data', async ({ page }) => {
  // Set up explicit data: one tap with description
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/tap/${tap.id}/edit`);

  // Wait for the page to load - check for Edit Tap header using testID
  await expect(page.getByTestId('header-edit-tap')).toBeVisible();
  
  // Wait for the tap-form to be visible
  await expect(page.getByTestId('tap-form')).toBeVisible();
  
  // Wait for the form input to be visible
  await expect(page.getByTestId('input-description')).toBeVisible();
  
  // TapForm has description field - assert it has the value if description exists
  if (tap.description) {
    await expect(page.getByTestId('input-description')).toHaveValue(tap.description);
  }
});

test('should successfully update tap', async ({ page }) => {
  // Set up explicit data: one tap with keg
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/tap/${tap.id}/edit`);

  // Wait for the page to load
  await expect(page.getByTestId('header-edit-tap')).toBeVisible();
  
  // Wait for the tap-form to be visible
  await expect(page.getByTestId('tap-form')).toBeVisible();
  
  // Wait for the form input to be visible
  await expect(page.getByTestId('input-description')).toBeVisible();

  await page.getByTestId('input-description').fill('Updated Tap Description');
  await expect(page.getByTestId('submit-button-edit-tap')).toBeVisible();
  await page.getByTestId('submit-button-edit-tap').click();

  // Success messages are dynamic content from API responses, so text-based locator is acceptable
  await expect(
    page.locator('text=/success|created|saved|updated/i'),
  ).toBeVisible();
});
