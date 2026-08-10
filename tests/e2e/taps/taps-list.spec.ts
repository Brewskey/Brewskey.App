import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should show empty state', async ({ page, tapPage, menuPage }) => {
  // No seed: a fresh account owns no taps.
  await menuPage.goto();
  await menuPage.clickTaps();

  // Empty state - list container is always visible, check for empty message
  await expect(tapPage.getTapsList()).toBeVisible();
  // Check for empty state button (NuxNoEntity component) - use testID
  await expect(page.getByTestId('button-get-started')).toBeVisible();
});

test.describe('with one tap', () => {
  test.use({ seed: { taps: 1 } });

  test('should navigate to tap details', async ({
    page,
    tapPage,
    menuPage,
    taps,
  }) => {
    const [tap] = taps;

    // Navigate through menu to taps
    await menuPage.goto();
    await menuPage.clickTaps();

    // Wait for list to load
    await expect(tapPage.getTapsList()).toBeVisible();

    // Click by the item's stable testid — a bare tap number matches many
    // elements on screen and is flaky under parallel load.
    const tapItem = page.getByTestId(`tap-item-${tap.id}`);
    await expect(tapItem).toBeVisible();
    await tapItem.click();

    await expect(page).toHaveURL(/.*tap.*details|tap.*\d+/i);
  });
});

test.describe('with a kegged tap', () => {
  // NewTapScreen requires a deviceId to render the form.
  test.use({ seed: { taps: [{ keg: true }] } });

  test('should navigate to create tap', async ({
    page,
    tapPage,
    menuPage,
    devices,
  }) => {
    const [device] = devices;

    // Navigate through menu to taps
    await menuPage.goto();
    await menuPage.clickTaps();

    // Wait for page to load
    await expect(tapPage.getTapsList()).toBeVisible();

    // Navigate to new tap screen with deviceId parameter
    // NewTapScreen gets organizationId from the device, so we only need deviceId
    await page.goto(`/taps/new?deviceId=${device.id}`);

    // Wait for the form to load - TapForm queries organization by ID from device
    await expect(
      page.getByTestId('tap-form-loading').or(page.getByTestId('tap-form')),
    ).toBeVisible();

    // Wait for loading to complete and form to be visible
    const loadingIndicator = page.getByTestId('tap-form-loading');
    if (await loadingIndicator.isVisible().catch(() => false)) {
      await expect(loadingIndicator).toBeHidden({ timeout: 20000 });
    }

    await expect(page.getByTestId('tap-form')).toBeVisible();

    // TapForm uses "description" field, not "tapNumber"
    await expect(page.getByTestId('input-description')).toBeVisible();
  });
});
