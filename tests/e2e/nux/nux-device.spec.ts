import { test, expect } from '../../fixtures/test-fixtures';
import { mockNewUserState } from '../../fixtures/entity-fixtures';

test('should display device naming screen', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoDeviceStep();
  

  await expect(page).toHaveURL(/.*nux.*device/i);
  // Device screen has testID - use that instead of text-based locator
  await expect(page.getByTestId('nux-device-content')).toBeVisible();
  await expect(page.getByTestId('nux-device-description')).toBeVisible();
});

test('should show device setup instructions', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoDeviceStep();
  

  // Instructions text has testID - use that instead of text-based locator
  await expect(page.getByTestId('nux-device-description')).toBeVisible();
});

test('should have continue button', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoDeviceStep();
  

  await expect(nuxPage.getContinueButton()).toBeVisible();
  await expect(nuxPage.getContinueButton()).toBeEnabled();
});
