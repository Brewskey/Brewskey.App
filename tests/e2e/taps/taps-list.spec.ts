import { test, expect } from '../../fixtures/test-fixtures';
import {
  mockLocationWithTaps,
  mockTapWithKeg,
} from '../../fixtures/entity-fixtures';

// Configure tests to auto-authenticate and create test data
test.use({ autoAuthenticate: true });

test('should show empty state', async ({ page, tapPage, menuPage }) => {
  // Set up explicit data: no taps (empty state)
  // Store is already empty from resetStores fixture

  // Navigate through menu to taps
  await menuPage.goto();
  await menuPage.clickTaps();

  // Empty state - list container is always visible, check for empty message
  await expect(tapPage.getTapsList()).toBeVisible();
  // Check for empty state button (NuxNoEntity component) - use testID
  await expect(page.getByTestId('button-get-started')).toBeVisible();
});

test('should navigate to tap details', async ({ page, tapPage, menuPage }) => {
  // Set up explicit data: one location with 1 tap
  const { taps } = await mockLocationWithTaps(page, 1);

  // Navigate through menu to taps
  await menuPage.goto();
  await menuPage.clickTaps();

  // Wait for list to load
  await expect(tapPage.getTapsList()).toBeVisible();

  // Tap number is dynamic content, so text-based locator is acceptable
  await tapPage.clickTap(taps[0].tapNumber);

  await expect(page).toHaveURL(/.*tap.*details|tap.*\d+/i);
});

test('should navigate to create tap', async ({ page, tapPage, menuPage }) => {
  // Set up explicit data: device for tap creation
  // NewTapScreen requires deviceId to render the form
  const { device } = await mockTapWithKeg(page);

  // Navigate through menu to taps
  await menuPage.goto();
  await menuPage.clickTaps();

  // Wait for page to load
  await expect(tapPage.getTapsList()).toBeVisible();

  // Navigate to new tap screen with deviceId parameter
  // NewTapScreen gets organizationId from the device, so we only need deviceId
  const url = `/(tabs)/taps/new?deviceId=${device.id}`;
  await page.goto(url);

  // Wait for the form to load - TapForm queries organization by ID from device
  // The form container has testID="tap-form" when organization is loaded
  // Organization query should complete and form should render
  // Wait for the form to appear (organization query completes)
  // Playwright's auto-waiting will handle timing
  await expect(
    page.getByTestId('tap-form-loading').or(page.getByTestId('tap-form')),
  ).toBeVisible();

  // Wait for loading to complete and form to be visible
  const loadingIndicator = page.getByTestId('tap-form-loading');
  if (await loadingIndicator.isVisible().catch(() => false)) {
    await expect(loadingIndicator).toBeHidden({ timeout: 20000 });
  }

  // Playwright's auto-waiting will handle timing
  await expect(page.getByTestId('tap-form')).toBeVisible();

  // After form is visible, check for the description input field
  // TapForm uses "description" field, not "tapNumber"
  await expect(page.getByTestId('input-description')).toBeVisible();
});
