/**
 * WiFi Setup flow e2e tests.
 *
 * Steps 1–2 are tested with mocked Brewskey API (devices, etc.).
 * SoftAP (device WiFi at 192.168.0.1) is mocked in soft-ap-mocks.ts.
 *
 * Tests that require step 3+ (network list, connect, finish) are currently
 * skipped because the browser blocks cross-origin requests from localhost to
 * 192.168.0.1 (Private Network Access). To enable them, the app would need a
 * test-only override for the SoftAP base URL (e.g. same-origin mock path).
 */
import { seedDeviceWithTaps } from '../../fixtures/entity-fixtures';
import { setupSoftApMocks } from '../../fixtures/soft-ap-mocks';
import { expect, test } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test.describe('WiFi Setup', () => {
  test('full flow: step 1 → step 2 → step 3 → step 4', async ({
    page,
    wifiPage, seedApi,}) => {
    setupSoftApMocks(page, {
      particleId: 'particle_e2e_flow',
      wifiNetworks: [
        { ch: 1, sec: 4194308, ssid: 'SecuredNetwork' },
        { ch: 6, sec: 0, ssid: 'OpenNet' },
      ],
    });

    const { device } = await seedDeviceWithTaps(seedApi, 0);
    await wifiPage.goto(String(device.id));

    await test.step('step 1: shows instructions and Ready button', async () => {
      await expect(page).toHaveURL(/.*wifi.*setup/i);
      await expect(page.getByTestId('wifi-setup-step1-content')).toBeVisible();
      await expect(
        page.getByTestId('section-header-wifi-setup-instructions'),
      ).toBeVisible();
      await expect(wifiPage.getReadyButton()).toBeVisible();
    });

    await test.step('step 1 → 2: Ready advances to connect instructions', async () => {
      await wifiPage.clickReady();
      await expect(
        page.getByTestId('section-header-wifi-connect'),
      ).toBeVisible();
    });

    await test.step('step 2 → 3: app advances to network list', async () => {
      await expect(page.getByTestId('wifi-networks-list')).toBeVisible({
        timeout: 20000,
      });
      await expect(
        page.getByTestId('wifi-network-item-SecuredNetwork0'),
      ).toBeVisible();
      await expect(
        page.getByTestId('wifi-network-item-OpenNet1'),
      ).toBeVisible();
    });

    await test.step('step 3: select network, enter password, connect', async () => {
      await page.getByTestId('wifi-network-item-SecuredNetwork0').click();

      const passwordInput = page.getByTestId(
        'wifi-network-item-password-SecuredNetwork0',
      );
      await expect(passwordInput).toBeVisible({ timeout: 5000 });
      await passwordInput.type('testpassword');

      await page
        .getByTestId('wifi-network-item-connect-SecuredNetwork0')
        .click();
    });

    await test.step('step 4: finish screen and Continue button visible', async () => {
      await expect(page.getByTestId('wifi-setup-step4-content')).toBeVisible({
        timeout: 20000,
      });
      await expect(
        page.getByTestId('section-header-wifi-setup-finish'),
      ).toBeVisible();
      await expect(
        page.getByTestId('button-wifi-setup-continue'),
      ).toBeVisible();

      await page.getByTestId('button-wifi-setup-continue').click();
    });
  });

  test('forNewDevice: step 1 shows Particle ID input when expanded', async ({
    page, seedApi,}) => {
    const { device } = await seedDeviceWithTaps(seedApi, 0);
    await page.goto(`/devices/${device.id}/wifi-setup?forNewDevice=true`);

    await expect(page.getByTestId('wifi-setup-step1-content')).toBeVisible();
    await page.getByTestId('button-expand-particle-id').click();
    await expect(page.getByTestId('input-particleId')).toBeVisible();
  });

  test('forNewDevice: step 4 Continue redirects to devices/new with particleId when no returnTo', async ({
    page, seedApi,}) => {
    const { device } = await seedDeviceWithTaps(seedApi, 0);
    await page.goto(`/devices/${device.id}/wifi-setup?forNewDevice=true`);
    await expect(page.getByTestId('wifi-setup-step1-content')).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId('button-expand-particle-id').click();
    await page.getByTestId('input-particleId').fill('particle_redirect_test');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByTestId('button-wifi-setup-continue').click();

    // Should navigate to devices/new with particleId param (no returnTo)
    await expect(page).toHaveURL(/\/devices\/new/i);
    await expect(page.getByTestId('input-name')).toBeVisible();
  });

  test('returnTo=nux-device: step 4 Continue redirects to nux/device with particleId', async ({
    page, seedApi,}) => {
    const { device, location } = await seedDeviceWithTaps(seedApi, 0);

    await page.goto(
      `/devices/${device.id}/wifi-setup?forNewDevice=true&returnTo=nux-device&locationId=${location.id}`,
    );
    await expect(page.getByTestId('wifi-setup-step1-content')).toBeVisible({
      timeout: 10000,
    });
    await page.getByTestId('button-expand-particle-id').click();
    await page.getByTestId('input-particleId').fill('particle_nux_device');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByTestId('button-wifi-setup-continue').click();

    // Should redirect to nux/device (returnTo=nux-device)
    await expect(page).toHaveURL(/\/device/i);
    await expect(page.getByTestId('nux-device-content')).toBeVisible();
  });
});
