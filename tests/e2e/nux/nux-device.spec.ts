import {
  mockLocationWithTaps,
  mockNewUserState,
} from '../../fixtures/entity-fixtures';
import { expect, test } from '../../fixtures/test-fixtures';

test('should show device setup instructions', async ({ page, nuxPage }) => {
  await mockNewUserState(page);
  await nuxPage.gotoDeviceStep();

  await expect(page.getByTestId('nux-device-description')).toBeVisible();
});

test('should have continue button', async ({ page, nuxPage }) => {
  await mockNewUserState(page);
  await nuxPage.gotoDeviceStep();

  await expect(nuxPage.getContinueButton()).toBeVisible();
  await expect(nuxPage.getContinueButton()).toBeEnabled();
});

test('should navigate to devices/new when Next is clicked', async ({
  page,
  nuxPage,
}) => {
  await mockNewUserState(page);
  const { location } = await mockLocationWithTaps(page, 0);

  await page.goto(
    `/(nux)/device?particleId=particle_test&locationId=${location.id}`,
  );
  await expect(page.getByTestId('nux-device-content')).toBeVisible();

  await nuxPage.getContinueButton().click();

  await expect(page).toHaveURL(/\/devices\/new/i);
});
