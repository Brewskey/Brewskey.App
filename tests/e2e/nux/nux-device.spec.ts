import { test, expect } from '../../fixtures/test-fixtures';
import { mockNewUserState } from '../../fixtures/entity-fixtures';

test('should display device naming screen', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoDeviceStep();
  

  await expect(page).toHaveURL(/.*nux.*device/i);
  // Device text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/device|box|brewskey/i'),
  ).toBeVisible();
});

test('should show device setup instructions', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoDeviceStep();
  

  // Instructions text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/connected|setup|configure/i'),
  ).toBeVisible();
});

test('should have continue button', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoDeviceStep();
  

  await expect(nuxPage.getContinueButton()).toBeVisible();
  await expect(nuxPage.getContinueButton()).toBeEnabled();
});
