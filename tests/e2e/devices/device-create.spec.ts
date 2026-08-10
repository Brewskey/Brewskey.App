import { expect, test } from '../../fixtures/test-fixtures';

// Need at least one location for device form (location picker)
test.use({ autoAuthenticate: true, seed: { locations: 1 } });

test('should successfully create device', async ({
  page,
  devicePage,
  dropDown,
  seedApi,
}) => {
  // A physical box registers with the device cloud before the user creates
  // its Brewskey record — mirror that so the details screen's online-status
  // read returns real data.
  await seedApi.registerCloudDevice('test_particle_1');
  await page.goto('/devices/new?particleId=test_particle_1');
  await expect(page.getByTestId('input-name')).toBeVisible();

  await devicePage.fillDeviceForm({
    name: 'New Device',
  });

  // Select location (required field) - one seeded location, use index 0
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
  seedApi,
}) => {
  await seedApi.registerCloudDevice('test_particle_2');
  await page.goto(
    '/devices/new?particleId=test_particle_2&returnTo=nux-tap&showBackButton=false',
  );
  await expect(page.getByTestId('input-name')).toBeVisible();

  await devicePage.fillDeviceForm({
    name: 'Nux Redirect Device',
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
