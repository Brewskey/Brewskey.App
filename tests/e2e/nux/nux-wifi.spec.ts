import { test, expect } from '../../fixtures/test-fixtures';
import { seedNewUserState } from '../../fixtures/entity-fixtures';

test('should display WiFi setup instructions', async ({ page, nuxPage, seedApi}) => {
  await seedNewUserState(page, seedApi);
  await nuxPage.gotoWifiStep();

  await expect(page).toHaveURL(/\/wifi/i);
  await expect(page.getByTestId('nux-wifi-content')).toBeVisible();
  await expect(page.getByTestId('nux-wifi-description')).toBeVisible();
});

test('should navigate to WiFi setup screen when Next is clicked', async ({
  page,
  nuxPage, seedApi,}) => {
  await seedNewUserState(page, seedApi);
  await nuxPage.gotoWifiStep();
  await expect(page.getByTestId('nux-wifi-content')).toBeVisible();

  await nuxPage.getContinueButton().click();

  // Next should navigate to wifi-setup (devices/new/wifi-setup)
  await expect(page).toHaveURL(/\/wifi-setup/i);
});

test('should have continue button', async ({ page, nuxPage, seedApi}) => {
  // Set up explicit data: new user
  await seedNewUserState(page, seedApi);
  await nuxPage.gotoWifiStep();

  await expect(nuxPage.getContinueButton()).toBeVisible();
  await expect(nuxPage.getContinueButton()).toBeEnabled();
});
