import { mockNewUserState } from '../../fixtures/entity-fixtures';
import { expect, test } from '../../fixtures/test-fixtures';

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

  await nuxPage.getContinueButton().click();

  await expect(page).toHaveURL(/\/device\/new/i);
});
