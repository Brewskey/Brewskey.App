import { expect, test } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test('should display tap creation prompt', async ({ page, nuxPage }) => {
  await nuxPage.gotoTapStep();

  await expect(page).toHaveURL('/tap');
  // Tap screen has testID - use that instead of text-based locator
  await expect(page.getByTestId('nux-tap-content')).toBeVisible();
  await expect(page.getByTestId('nux-tap-description')).toBeVisible();
});

test('should show tap setup instructions', async ({ page, nuxPage }) => {
  await nuxPage.gotoTapStep();

  // Instructions text has testID - use that instead of text-based locator
  await expect(page.getByTestId('nux-tap-description')).toBeVisible();
});

test('should navigate to devices list when Next is clicked without deviceId', async ({
  page,
  nuxPage,
}) => {
  await nuxPage.gotoTapStep();
  await expect(page.getByTestId('nux-tap-content')).toBeVisible();

  await nuxPage.getContinueButton().click();

  // Without deviceId, Next navigates to devices list
  await expect(page).toHaveURL(/\/devices/i);
});

test('should have continue button', async ({ nuxPage }) => {
  await nuxPage.gotoTapStep();

  await expect(nuxPage.getContinueButton()).toBeVisible();
  await expect(nuxPage.getContinueButton()).toBeEnabled();
});

test.describe('with a device', () => {
  test.use({ seed: { devices: 1 } });

  test('should navigate to taps/new when Next is clicked with deviceId', async ({
    page,
    nuxPage,
    devices,
  }) => {
    const [device] = devices;

    await page.goto(`/(nux)/tap?deviceId=${device.id}`);
    await expect(page.getByTestId('nux-tap-content')).toBeVisible();

    await nuxPage.getContinueButton().click();

    // With deviceId, Next navigates to taps/new
    await expect(page).toHaveURL(/\/taps\/new/i);
  });
});
