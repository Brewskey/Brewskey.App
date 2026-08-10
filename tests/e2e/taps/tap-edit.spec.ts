import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test.describe('tap with description', () => {
  test.use({
    seed: { taps: [{ keg: true, description: 'Test Tap Description' }] },
  });

  test('should pre-fill form with existing data when tap has description', async ({
    page,
    taps,
  }) => {
    const [tap] = taps;

    await page.goto(`/taps/${tap.id}/edit/tap`);

    // Wait for the page to load - check for Edit Tap header using testID
    await expect(page.getByTestId('header-edit-tap')).toBeVisible();

    // Wait for the form to be visible (loading indicator will disappear automatically)
    // TapForm shows tap-form-loading while organization query is loading
    await expect(page.getByTestId('tap-form')).toBeVisible({ timeout: 10000 });

    // Wait for the form input to be visible (with longer timeout for organization query)
    await expect(page.getByTestId('input-description')).toBeVisible({
      timeout: 10000,
    });

    // TapForm has description field - assert it has the value
    await expect(page.getByTestId('input-description')).toHaveValue(
      'Test Tap Description',
    );
  });
});

test.describe('tap with empty description', () => {
  // Kegged tap with description '' so the tap has organization, location,
  // device (required for edit route)
  test.use({ seed: { taps: [{ keg: true, description: '' }] } });

  test('should pre-fill form with existing data when tap has no description', async ({
    page,
    taps,
  }) => {
    const [tap] = taps;

    await page.goto(`/taps/${tap.id}/edit/tap`);

    await expect(page.getByTestId('header-edit-tap')).toBeVisible();
    // TapForm shows tap-form-loading until org loads; then tap-form
    await expect(page.getByTestId('tap-form')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('input-description')).toBeVisible();
    await expect(page.getByTestId('input-description')).toHaveValue('');
  });
});

test.describe('kegged tap', () => {
  test.use({ seed: { taps: [{ keg: true }] } });

  test('should successfully update tap', async ({ page, dropDown, taps }) => {
    const [tap] = taps;

    await page.goto(`/taps/${tap.id}/edit/tap`);
    await expect(page.getByTestId('header-edit-tap')).toBeVisible();
    await expect(page.getByTestId('tap-form')).toBeVisible();
    await expect(page.getByTestId('input-description')).toBeVisible();

    // Mutate every form field: description, deviceId, hideLeaderboard, hideStats, disableBadges
    // (isPaymentEnabled is conditional on organization.canEnablePayments)
    await page.getByTestId('input-description').fill('Updated Tap Description');

    // Device (dropdown) - one seeded device, select first option (index 0)
    const deviceDd = dropDown.create('device-dropdown');
    await deviceDd.select(0);

    // Checkboxes
    await page.getByTestId('input-hideLeaderboard').click();
    await page.getByTestId('input-hideStats').click();
    await page.getByTestId('input-disableBadges').click();

    await expect(page.getByTestId('submit-button-edit-tap')).toBeVisible();
    await page.getByTestId('submit-button-edit-tap').click();

    await expect(page.getByTestId('snackbar-message')).toBeVisible();
    await expect(page.getByTestId('snackbar-message')).toHaveText(
      'Successfully edited tap',
    );
  });
});
