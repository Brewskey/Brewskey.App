import { test, expect } from '../../fixtures/test-fixtures';
import { mockTapWithKeg } from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should navigate to edit tap', async ({ page }) => {
  // Set up explicit data: one tap with keg
  const { tap } = await mockTapWithKeg(page);

  // Edit tap route redirects to /taps/[tapId]/edit/feed by default
  // But for basic edit form, go directly to /taps/[tapId]/edit/basic
  await page.goto(`/taps/${tap.id}/edit/basic`);

  await expect(page).toHaveURL(/.*tap.*edit|edit.*tap/i);
  // Wait for header to be visible - basic edit route has "Edit Tap" header
  await expect(page.getByTestId('header-edit-tap')).toBeVisible({ timeout: 10000 });
});

test('should pre-fill form with existing data when tap has description', async ({ page }) => {
  // Set up explicit data: one tap with description
  const { tap } = await mockTapWithKeg(page, 'Test Tap Description');

  await page.goto(`/taps/${tap.id}/edit/basic`);

  // Wait for the page to load - check for Edit Tap header using testID
  await expect(page.getByTestId('header-edit-tap')).toBeVisible();
  
  // Wait for loading indicator to disappear (if present) and form to appear
  // TapForm shows tap-form-loading while organization query is loading
  const loadingIndicator = page.getByTestId('tap-form-loading');
  const form = page.getByTestId('tap-form');
  
  // Wait for either loading to finish or form to appear
  await Promise.race([
    loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {}),
    form.waitFor({ state: 'visible', timeout: 10000 }),
  ]);
  
  // Now wait for the form to be visible
  await expect(form).toBeVisible({ timeout: 10000 });
  
  // Wait for the form input to be visible (with longer timeout for organization query)
  await expect(page.getByTestId('input-description')).toBeVisible({ timeout: 10000 });
  
  // TapForm has description field - assert it has the value
  await expect(page.getByTestId('input-description')).toHaveValue('Test Tap Description');
});

test('should pre-fill form with existing data when tap has no description', async ({ page }) => {
  // Set up explicit data: one tap without description
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/edit/basic`);

  // Wait for the page to load - check for Edit Tap header using testID
  await expect(page.getByTestId('header-edit-tap')).toBeVisible();
  
  // Wait for loading indicator to disappear (if present) and form to appear
  // TapForm shows tap-form-loading while organization query is loading
  const loadingIndicator = page.getByTestId('tap-form-loading');
  const form = page.getByTestId('tap-form');
  
  // Wait for either loading to finish or form to appear
  await Promise.race([
    loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {}),
    form.waitFor({ state: 'visible', timeout: 10000 }),
  ]);
  
  // Now wait for the form to be visible
  await expect(form).toBeVisible({ timeout: 10000 });
  
  // Wait for the form input to be visible (with longer timeout for organization query)
  await expect(page.getByTestId('input-description')).toBeVisible({ timeout: 10000 });
  
  // Description field should be empty when tap has no description
  await expect(page.getByTestId('input-description')).toHaveValue('');
});

test('should successfully update tap', async ({ page }) => {
  // Set up explicit data: one tap with keg
  const { tap } = await mockTapWithKeg(page);

  await page.goto(`/taps/${tap.id}/edit/basic`);

  // Wait for the page to load
  await expect(page.getByTestId('header-edit-tap')).toBeVisible();
  
  // Wait for the tap-form to be visible
  await expect(page.getByTestId('tap-form')).toBeVisible();
  
  // Wait for the form input to be visible
  await expect(page.getByTestId('input-description')).toBeVisible();

  await page.getByTestId('input-description').fill('Updated Tap Description');
  await expect(page.getByTestId('submit-button-edit-tap')).toBeVisible();
  await page.getByTestId('submit-button-edit-tap').click();

  // Success messages use SnackBar component with testID
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
});
