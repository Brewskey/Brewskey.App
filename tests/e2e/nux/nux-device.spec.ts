import { expect, test } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should show device setup instructions', async ({ page, nuxPage }) => {
  await nuxPage.gotoDeviceStep();

  await expect(page.getByTestId('nux-device-description')).toBeVisible();
});

test('should have continue button', async ({ nuxPage }) => {
  await nuxPage.gotoDeviceStep();

  await expect(nuxPage.getContinueButton()).toBeVisible();
  await expect(nuxPage.getContinueButton()).toBeEnabled();
});

test.describe('with a location', () => {
  test.use({ seed: { devices: 1 } });

  test('should navigate to devices/new when Next is clicked', async ({
    page,
    nuxPage,
    locations,
    seedApi,
  }) => {
    const [location] = locations;

    // The box this flow sets up would already exist in the device cloud.
    await seedApi.registerCloudDevice('particle_test');
    await page.goto(
      `/(nux)/device?particleId=particle_test&locationId=${location.id}`,
    );
    await expect(page.getByTestId('nux-device-content')).toBeVisible();

    await nuxPage.getContinueButton().click();

    await expect(page).toHaveURL(/\/devices\/new/i);
  });
});
