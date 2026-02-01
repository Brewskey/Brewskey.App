import { expect, test } from '../../fixtures/test-fixtures';

// Need at least one location for device form (location picker)
test.use({ autoAuthenticate: true, locationCount: 1 });

test('should successfully create device', async ({
  page,
  devicePage,
  dropDown,
}) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  // Need location for device creation
  const { mockLocationWithTaps } =
    await import('../../fixtures/entity-fixtures');
  const { location } = await mockLocationWithTaps(page, 0);

  await page.goto('/devices/new');
  await expect(page.getByTestId('input-name')).toBeVisible();

  await devicePage.fillDeviceForm({
    name: 'New Device',
    particleId: 'particle_12345',
  });

  // Select location (required field) - one location from mock, use index 0
  const locationPicker = dropDown.create('location-dropdown');
  await locationPicker.select(0);
  await expect(locationPicker.modal).not.toBeVisible();

  // Wait for form to become valid (submit button enabled) after location selection
  // Form re-validation after dropdown close can take a moment
  const submitButton = page.getByTestId('submit-button-create-device');
  await expect(submitButton).toBeEnabled({ timeout: 15000 });
  await submitButton.scrollIntoViewIfNeeded();
  await submitButton.click();

  // Wait for navigation to device details page
  await expect(page).toHaveURL(/.*devices\/\d+/i);

  // Success messages use SnackBar component with testID
  // Verify exact success message text
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText(
    'New Brewskey box created',
  );
});

test('should redirect to nux/tap when returnTo=nux-tap after create', async ({
  page,
  devicePage,
  dropDown,
}) => {
  const { mockLocationWithTaps } =
    await import('../../fixtures/entity-fixtures');
  const { location } = await mockLocationWithTaps(page, 0);

  await page.goto('/devices/new?returnTo=nux-tap&showBackButton=false');
  await expect(page.getByTestId('input-name')).toBeVisible();

  await devicePage.fillDeviceForm({
    name: 'Nux Redirect Device',
    particleId: 'particle_nux_redirect',
  });
  const locationPicker = dropDown.create('location-dropdown');
  await locationPicker.select(0);
  const submitButton = page.getByTestId('submit-button-create-device');
  await expect(submitButton).toBeEnabled({ timeout: 15000 });
  await submitButton.click();

  // Should redirect to nux/tap with deviceId (returnTo=nux-tap)
  await expect(page).toHaveURL(/\/tap/i);
  await expect(page.getByTestId('nux-tap-content')).toBeVisible();
});
