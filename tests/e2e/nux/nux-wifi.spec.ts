import { test, expect } from '../../fixtures/test-fixtures';
import { mockNewUserState } from '../../fixtures/entity-fixtures';

test('should display WiFi setup instructions', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoWifiStep();

  await expect(page).toHaveURL(/.*nux.*wifi/i);
  // WiFi screen has testID - use that instead of text-based locator
  await expect(page.getByTestId('nux-wifi-content')).toBeVisible();
  await expect(page.getByTestId('nux-wifi-description')).toBeVisible();
});

test('should navigate to WiFi setup screen when Next is clicked', async ({
  page,
  nuxPage,
}) => {
  await mockNewUserState(page);
  await nuxPage.gotoWifiStep();
  await expect(page.getByTestId('nux-wifi-content')).toBeVisible();

  await nuxPage.getContinueButton().click();

  // Next should navigate to wifi-setup (devices/new/wifi-setup)
  await expect(page).toHaveURL(/\/wifi-setup/i);
});

test('should have continue button', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoWifiStep();

  await expect(nuxPage.getContinueButton()).toBeVisible();
  await expect(nuxPage.getContinueButton()).toBeEnabled();
});
