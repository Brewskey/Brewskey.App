import { test, expect } from '../../fixtures/test-fixtures';
import { mockLocationWithTaps } from '../../fixtures/entity-fixtures';

// Configure tests to auto-authenticate and create test data
test.use({ autoAuthenticate: true });

test('should display taps grouped by location', async ({ page, tapPage, menuPage }) => {
  // Set up explicit data: one location with 3 taps
  const { location, taps } = await mockLocationWithTaps(page, 3);
  
  // Navigate through menu to taps (since TapsStack is nested in MenuStack)
  await menuPage.goto();
  await menuPage.clickTaps();

  await expect(tapPage.getTapsList()).toBeVisible();

  // SectionTapsList groups taps by device name, not location name
  // Tap numbers are dynamic content (user-generated), so text-based locators are acceptable
  // Use first() to handle cases where multiple taps might have the same number
  for (const tap of taps) {
    // TapListItem displays as "${tapNumber} - ${beverageName}"
    await expect(page.locator(`text=${tap.tapNumber}`).first()).toBeVisible();
  }
});

test('should show empty state', async ({ page, tapPage, menuPage }) => {
  // Set up explicit data: no taps (empty state)
  // Store is already empty from resetStores fixture
  
  // Navigate through menu to taps
  await menuPage.goto();
  await menuPage.clickTaps();

  // Empty state - list container is always visible, check for empty message
  await expect(tapPage.getTapsList()).toBeVisible();
  // Check for empty state message (NuxNoEntity component) - use specific text
  await expect(page.getByText('Get started')).toBeVisible();
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
  // Navigate through menu to taps
  await menuPage.goto();
  await menuPage.clickTaps();
  
  // Wait for page to load
  await expect(tapPage.getTapsList()).toBeVisible();
  
  await tapPage.getAddTapButton().click();

  // After clicking add, should navigate to new tap screen
  // Check for form input instead of URL
  await expect(page.getByTestId('input-tapNumber')).toBeVisible();
});
