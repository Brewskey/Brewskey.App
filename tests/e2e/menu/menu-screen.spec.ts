import { test, expect } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should display menu screen', async ({ page, menuPage }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await menuPage.goto();

  await expect(page).toHaveURL(/.*menu/i);
  
});

test('should show user block', async ({ page, menuPage }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await menuPage.goto();
  

  // User block text is dynamic content (user name), so text-based locator is acceptable
  await expect(
    page.locator('text=/user|profile|account/i'),
  ).toBeVisible();
});

test('should navigate to friends', async ({ page, menuPage }) => {
  await menuPage.goto();
  await menuPage.clickFriends();

  await expect(page).toHaveURL(/.*friends/i);
});

test('should navigate to locations', async ({ page, menuPage }) => {
  await menuPage.goto();
  await menuPage.clickLocations();

  await expect(page).toHaveURL(/.*locations/i);
});

test('should navigate to taps', async ({ page, menuPage }) => {
  await menuPage.goto();
  await menuPage.clickTaps();

  await expect(page).toHaveURL(/.*taps/i);
});

test('should navigate to devices', async ({ page, menuPage }) => {
  await menuPage.goto();
  await menuPage.clickDevices();

  await expect(page).toHaveURL(/.*devices/i);
});

test('should navigate to beverages', async ({ page, menuPage }) => {
  await menuPage.goto();
  await menuPage.clickBeverages();

  await expect(page).toHaveURL(/.*beverages/i);
});

test('should navigate to help', async ({ page, menuPage }) => {
  await menuPage.goto();
  await menuPage.clickHelp();

  await expect(page).toHaveURL(/.*help/i);
});

test('should navigate to settings', async ({ page, menuPage }) => {
  await menuPage.goto();
  await menuPage.clickSettings();

  await expect(page).toHaveURL(/.*settings/i);
});
