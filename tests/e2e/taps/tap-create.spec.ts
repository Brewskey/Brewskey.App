import {
  seedDeviceWithTaps,
  seedLocationWithTaps,
} from '../../fixtures/entity-fixtures';
import { expect, test } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should successfully create tap', async ({ page, tapPage, seedApi}) => {
  // Set up explicit data: one location and one device
  const { location } = await seedLocationWithTaps(seedApi, 0);
  const { device } = await seedDeviceWithTaps(seedApi, 0);

  await page.goto(`/taps/new?deviceId=${device.id}`);
  // Playwright's auto-waiting will handle timing
  await expect(
    page.getByTestId('tap-form-loading').or(page.getByTestId('tap-form')),
  ).toBeVisible();
  await expect(page.getByTestId('input-description')).toBeVisible();

  await tapPage.fillTapForm({
    name: 'New Tap',
    deviceId: device.id as number,
    locationId: location.id as number,
  });

  // Mutate checkboxes: hideLeaderboard, hideStats, disableBadges (isPaymentEnabled is conditional)
  await page.getByTestId('input-hideLeaderboard').click();
  await page.getByTestId('input-hideStats').click();
  await page.getByTestId('input-disableBadges').click();

  await tapPage.submitForm();

  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText(
    'New tap created',
  );
});

test('should set up tap and select beverage with image rendering', async ({
  page,
  tapPage,
  dropDown, seedApi,}) => {
  // Set up explicit data: location, device, and beverage
  const { location } = await seedLocationWithTaps(seedApi, 0);
  const { device } = await seedDeviceWithTaps(seedApi, 0);
  const beverage = await seedApi.createBeverage({ name: 'Test IPA' });

  // Step 1: Create a tap
  await page.goto(`/taps/new?deviceId=${device.id}`);
  // Playwright's auto-waiting will handle timing
  await expect(
    page.getByTestId('tap-form-loading').or(page.getByTestId('tap-form')),
  ).toBeVisible();
  await expect(page.getByTestId('input-description')).toBeVisible();

  await tapPage.fillTapForm({
    name: 'New Tap with Beverage',
    deviceId: device.id as number,
    locationId: location.id as number,
  });
  await tapPage.submitForm();

  // Wait for success message and verify exact text
  await expect(page.getByTestId('snackbar-message')).toBeVisible();
  await expect(page.getByTestId('snackbar-message')).toHaveText(
    'New tap created',
  );

  // Step 2: Seed a real tap for navigation
  const tap = await seedApi.createTap(location, device, {
    description: 'New Tap with Beverage',
  });

  // Navigate to tap details and then to keg creation (Expo web paths without (tabs))
  await page.goto(`/taps/${tap.id}`);
  await expect(page.getByTestId('header-tap-details')).toBeVisible();

  // Navigate to create keg (which includes beverage selection)
  await page.goto(`/taps/${tap.id}/keg/new`);

  // Step 3: Verify beverage picker is visible and works
  await expect(page.getByTestId('keg-form')).toBeVisible();
  const beveragePicker = dropDown.create('beverage-dropdown');
  await expect(beveragePicker.input).toBeVisible();

  // Step 4: Open beverage picker and verify images are rendered
  await beveragePicker.input.click();

  // Wait for modal to appear and beverage list to load
  await expect(page.getByText(beverage.name)).toBeVisible();

  // Verify the beverage row (WebDropdown uses option-{index})
  const beverageRow = beveragePicker.getItemByIndex(0);
  await expect(beverageRow).toBeVisible();

  // Verify the beverage name is displayed
  await expect(beverageRow.getByText(beverage.name)).toBeVisible();

  // Step 5: Verify an image/avatar element is present in the beverage row
  // BeverageAvatar may render Image (expo-image) or a placeholder; assert element is present
  const beverageImage = beverageRow
    .locator('img')
    .or(beverageRow.locator('[data-testid*="avatar"]'));
  await expect(beverageImage.first()).toBeVisible();

  // Step 6: Select the beverage
  await beverageRow.click();
  // Selection is confirmed immediately (no confirmation button needed)

  // Verify the selection was successful - the picker should show the selected beverage
  await expect(page.getByTestId('keg-form')).toBeVisible();

  // Verify the beverage picker now shows the selected beverage name
  await expect(beveragePicker.input).toContainText(beverage.name);
});
