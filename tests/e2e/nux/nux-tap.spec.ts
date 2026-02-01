import { mockNewUserState } from '../../fixtures/entity-fixtures';
import { expect, test } from '../../fixtures/test-fixtures';

test('should display tap creation prompt', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoTapStep();

  await expect(page).toHaveURL('/tap');
  // Tap screen has testID - use that instead of text-based locator
  await expect(page.getByTestId('nux-tap-content')).toBeVisible();
  await expect(page.getByTestId('nux-tap-description')).toBeVisible();
});

test('should show tap setup instructions', async ({ page, nuxPage }) => {
  // Set up explicit data: new user
  await mockNewUserState(page);
  await nuxPage.gotoTapStep();

  // Instructions text has testID - use that instead of text-based locator
  await expect(page.getByTestId('nux-tap-description')).toBeVisible();
});

test('should navigate to devices list when Next is clicked without deviceId', async ({
  page,
  nuxPage,
}) => {
  await mockNewUserState(page);
  await nuxPage.gotoTapStep();
  await expect(page.getByTestId('nux-tap-content')).toBeVisible();

  await nuxPage.getContinueButton().click();

  // Without deviceId, Next navigates to devices list
  await expect(page).toHaveURL(/\/devices/i);
});

test('should navigate to taps/new when Next is clicked with deviceId', async ({
  page,
  nuxPage,
}) => {
  const { mockDeviceWithTaps } = await import('../../fixtures/entity-fixtures');
  await mockNewUserState(page);
  const { device } = await mockDeviceWithTaps(page, 0);

  await page.goto(`/(nux)/tap?deviceId=${device.id}`);
  await expect(page.getByTestId('nux-tap-content')).toBeVisible();

  await nuxPage.getContinueButton().click();

  // With deviceId, Next navigates to taps/new
  await expect(page).toHaveURL(/\/taps\/new/i);
});

test('should have continue button', async ({ page, nuxPage }) => {
  await mockNewUserState(page);
  await nuxPage.gotoTapStep();

  await expect(nuxPage.getContinueButton()).toBeVisible();
  await expect(nuxPage.getContinueButton()).toBeEnabled();
});
