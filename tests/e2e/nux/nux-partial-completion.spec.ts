import { expect, test } from '../../fixtures/test-fixtures';

/**
 * Tests to verify that NUX persists when user stops partway through setup
 *
 * The NUX flow should continue to appear until the user has completed:
 * 1. Created at least one location
 * 2. Created at least one device
 * 3. Created at least one tap
 *
 * If a user stops at any point, they should see NUX when navigating to screens
 * that require the missing entities.
 */

test.use({ autoAuthenticate: true });

test.describe('NUX Partial Completion - Location Only', () => {
  // User has created a location but no devices or taps.
  test.use({ seed: { locations: 1 } });

  test('should show NUX on devices screen when user has location but no devices', async ({
    page,
    devicePage,
  }) => {
    // Navigate to devices screen
    await devicePage.goto();

    // Wait for the devices list query to complete (loading finishes)
    // The list shows ListEmptyComponent only when !isLoading
    await expect(page.getByTestId('devices-list')).toBeVisible({
      timeout: 10000,
    });

    // Should show NUX because no devices exist
    await expect(page.getByTestId('nux-no-entity-content')).toBeVisible();
    await page.getByTestId('button-get-started').click();
    await expect(page.getByTestId('button-next')).toBeVisible();
  });

  test('should show NUX on taps screen when user has location but no devices', async ({
    page,
    menuPage,
  }) => {
    // Navigate to taps screen through menu
    await menuPage.goto();
    await menuPage.clickTaps();

    // Wait for the taps list query to complete (loading finishes)
    // The list shows ListEmptyComponent only when !isLoading
    await expect(page.getByTestId('taps-list')).toBeVisible({ timeout: 10000 });

    // Should show NUX because no taps exist (and likely no devices)
    await expect(page.getByTestId('nux-no-entity-content')).toBeVisible();
    await page.getByTestId('button-get-started').click();
    await expect(page.getByTestId('button-next')).toBeVisible();
  });

  test('should NOT show NUX on locations screen when user has location', async ({
    page,
    locationPage,
  }) => {
    // Navigate to locations screen
    await locationPage.goto();

    // Should NOT show NUX because locations exist
    await expect(page.getByTestId('nux-no-entity-content')).not.toBeVisible();
    // Should show locations list instead
    await expect(locationPage.getLocationsList()).toBeVisible();
  });
});

test.describe('NUX Partial Completion - Location and Device', () => {
  // User has created a location and a device but no taps.
  test.use({ seed: { devices: 1 } });

  test('should show NUX on taps screen when user has location and device but no taps', async ({
    page,
    menuPage,
  }) => {
    // Load menu first, then navigate to taps
    await menuPage.goto();
    await menuPage.clickTaps();

    // Wait for NUX empty state (no taps exist)
    await expect(page.getByTestId('nux-no-entity-content')).toBeVisible({
      timeout: 10000,
    });

    // Should show NUX because no taps exist
    await expect(page.getByTestId('nux-no-entity-content')).toBeVisible();
    await expect(page.getByTestId('button-get-started')).toBeVisible();
  });

  test('should NOT show NUX on devices screen when user has devices', async ({
    page,
    devicePage,
  }) => {
    // Navigate to devices screen
    await devicePage.goto();

    // Should NOT show NUX because devices exist
    await expect(page.getByTestId('nux-no-entity-content')).not.toBeVisible();
    // Should show devices list instead
    await expect(devicePage.getDevicesList()).toBeVisible();
  });

  test('should NOT show NUX on locations screen when user has location and device', async ({
    page,
    locationPage,
  }) => {
    // Navigate to locations screen
    await locationPage.goto();

    // Should NOT show NUX because locations exist
    await expect(page.getByTestId('nux-no-entity-content')).not.toBeVisible();
    // Should show locations list instead
    await expect(locationPage.getLocationsList()).toBeVisible();
  });
});

test.describe('NUX Partial Completion - Complete Setup', () => {
  // User has completed full setup (location, device, tap).
  test.use({ seed: { devices: 1, taps: 1 } });

  test('should NOT show NUX on any screen when user has completed setup', async ({
    page,
    locationPage,
    devicePage,
    menuPage,
  }) => {
    // Navigate to locations screen - should NOT show NUX
    await locationPage.goto();
    await expect(page.getByTestId('nux-no-entity-content')).not.toBeVisible();
    await expect(locationPage.getLocationsList()).toBeVisible();

    // Navigate to devices screen - should NOT show NUX
    await devicePage.goto();
    await expect(page.getByTestId('nux-no-entity-content')).not.toBeVisible();
    await expect(devicePage.getDevicesList()).toBeVisible();

    // Navigate to taps: menu first then taps
    await menuPage.goto();
    await menuPage.clickTaps();
    await expect(page.getByTestId('nux-no-entity-content')).not.toBeVisible();
    await expect(page.getByTestId('taps-list')).toBeVisible();
  });
});

test.describe('NUX Navigation Flow - Partial Completion', () => {
  test.describe(() => {
    // User has created a location but no devices.
    test.use({ seed: { locations: 1 } });

    test('should allow user to continue NUX flow from devices screen after creating location', async ({
      page,
      devicePage,
    }) => {
      // Navigate to devices screen - should show NUX
      await devicePage.goto();

      // Wait for the devices list query to complete (loading finishes)
      await expect(page.getByTestId('devices-list')).toBeVisible({
        timeout: 10000,
      });

      await expect(page.getByTestId('nux-no-entity-content')).toBeVisible();

      // Click "Get started" button to start NUX flow
      await page.getByTestId('button-get-started').click();

      // Should navigate to NUX location step (or appropriate step)
      // The flow should continue from where they left off (app may not add locationsCount query)
      await expect(page).toHaveURL(/\/location/i);
    });
  });

  test.describe(() => {
    // User has created a location and a device but no taps.
    test.use({ seed: { devices: 1 } });

    test('should allow user to continue NUX flow from taps screen after creating location and device', async ({
      page,
      menuPage,
    }) => {
      // Load menu first, then navigate to taps
      await menuPage.goto();
      await menuPage.clickTaps();

      // Wait for NUX empty state (no taps exist)
      await expect(page.getByTestId('nux-no-entity-content')).toBeVisible({
        timeout: 10000,
      });

      await expect(page.getByTestId('nux-no-entity-content')).toBeVisible();

      // Click "Get started" button to start NUX flow
      await page.getByTestId('button-get-started').click();

      // Should navigate to NUX flow (likely location step; app may not add locationsCount query)
      await expect(page).toHaveURL(/\/location/i);
    });
  });
});

test.describe('NUX State Persistence - Multiple Sessions', () => {
  test.describe(() => {
    // User has created a location but no devices.
    test.use({ seed: { locations: 1 } });

    test('should persist NUX requirement across navigation when setup incomplete', async ({
      page,
      devicePage,
      locationPage,
    }) => {
      // Navigate to devices screen - should show NUX
      await devicePage.goto();

      // Wait for the devices list query to complete (loading finishes)
      await expect(page.getByTestId('devices-list')).toBeVisible({
        timeout: 10000,
      });

      await expect(page.getByTestId('nux-no-entity-content')).toBeVisible();

      // Navigate away to locations screen
      await locationPage.goto();
      await expect(page.getByTestId('nux-no-entity-content')).not.toBeVisible();

      // Navigate back to devices screen - should STILL show NUX
      await devicePage.goto();

      // Wait for the devices list query to complete again
      await expect(page.getByTestId('devices-list')).toBeVisible({
        timeout: 10000,
      });

      await expect(page.getByTestId('nux-no-entity-content')).toBeVisible();
    });
  });

  test.describe(() => {
    // User has created a location and a device but no taps.
    test.use({ seed: { devices: 1 } });

    test('should persist NUX requirement on taps screen until taps are created', async ({
      page,
      devicePage,
      menuPage,
    }) => {
      // Load menu first, then navigate to taps
      await menuPage.goto();
      await menuPage.clickTaps();

      // Wait for NUX empty state (no taps exist)
      await expect(page.getByTestId('nux-no-entity-content')).toBeVisible({
        timeout: 10000,
      });

      await expect(page.getByTestId('nux-no-entity-content')).toBeVisible();

      // Navigate away to devices screen
      await devicePage.goto();
      await expect(page.getByTestId('nux-no-entity-content')).not.toBeVisible();

      // Navigate back to taps screen - should STILL show NUX
      await menuPage.goto();
      await menuPage.clickTaps();

      // Wait for NUX empty state again
      await expect(page.getByTestId('nux-no-entity-content')).toBeVisible({
        timeout: 10000,
      });

      await expect(page.getByTestId('nux-no-entity-content')).toBeVisible();
    });
  });
});

test.describe('NUX Progressive Completion', () => {
  // No initial seed: starts as a brand-new user. Entities are created
  // mid-test through the real API (seedApi) to simulate the user
  // progressing through setup.
  test('should show NUX at each incomplete step during progressive setup', async ({
    page,
    locationPage,
    devicePage,
    menuPage,
    seedApi,
  }) => {
    // Step 1: Check locations screen - should show NUX (no locations)
    await locationPage.goto();

    // Wait for the locations list query to complete (loading finishes)
    await expect(page.getByTestId('locations-list')).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId('nux-no-entity-content')).toBeVisible();

    // Simulate user creating a location (real API)
    const location = await seedApi.createLocation();

    // Step 2: Check locations screen again - should NOT show NUX (location exists)
    await locationPage.goto();
    await expect(page.getByTestId('nux-no-entity-content')).not.toBeVisible();
    await expect(locationPage.getLocationsList()).toBeVisible();

    // Step 3: Check devices screen - should show NUX (no devices yet)
    await devicePage.goto();

    // Wait for the devices list query to complete (loading finishes)
    await expect(page.getByTestId('devices-list')).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId('nux-no-entity-content')).toBeVisible();

    // Simulate user creating a device (real API)
    const device = await seedApi.createDevice(location);

    // Step 4: Check devices screen again - should NOT show NUX (device exists)
    await devicePage.goto();
    await expect(page.getByTestId('nux-no-entity-content')).not.toBeVisible();
    await expect(devicePage.getDevicesList()).toBeVisible();

    // Step 5: Check taps screen - should show NUX (no taps yet)
    await menuPage.goto();
    await menuPage.clickTaps();

    // Wait for NUX empty state (no taps yet)
    await expect(page.getByTestId('nux-no-entity-content')).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByTestId('nux-no-entity-content')).toBeVisible();

    // Simulate user creating a tap (real API)
    await seedApi.createTap(location, device);

    // Step 6: Check taps screen again - should NOT show NUX (tap exists)
    await menuPage.goto();
    await menuPage.clickTaps();
    await expect(page.getByTestId('nux-no-entity-content')).not.toBeVisible();
    await expect(page.getByTestId('taps-list')).toBeVisible();

    // Step 7: Verify NUX no longer appears on any screen
    await locationPage.goto();
    await expect(page.getByTestId('nux-no-entity-content')).not.toBeVisible();

    await devicePage.goto();
    await expect(page.getByTestId('nux-no-entity-content')).not.toBeVisible();

    await menuPage.goto();
    await menuPage.clickTaps();
    await expect(page.getByTestId('nux-no-entity-content')).not.toBeVisible();
  });
});
