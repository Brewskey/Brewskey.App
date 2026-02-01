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
import { mockDeviceWithTaps } from '../../fixtures/entity-fixtures';
import { setupSoftApMocks } from '../../fixtures/soft-ap-mocks';
import { expect, test } from '../../fixtures/test-fixtures';

test.use({ autoAuthenticate: true });

test.describe('WiFi Setup', () => {
  test('step 1: shows instructions and Ready button', async ({
    page,
    wifiPage,
  }) => {
    const { device } = await mockDeviceWithTaps(page, 0);
    await wifiPage.goto(String(device.id));

    await expect(page).toHaveURL(/.*wifi.*setup/i);
    await expect(page.getByTestId('wifi-setup-step1-content')).toBeVisible();
    await expect(
      page.getByTestId('section-header-wifi-setup-instructions'),
    ).toBeVisible();
    await expect(wifiPage.getReadyButton()).toBeVisible();
  });

  test('step 1 → step 2: Ready advances to connect instructions', async ({
    page,
    wifiPage,
  }) => {
    const { device } = await mockDeviceWithTaps(page, 0);
    await wifiPage.goto(String(device.id));

    await wifiPage.clickReady();

    await expect(page.getByTestId('wifi-setup-step2-content')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByTestId('section-header-wifi-connect')).toBeVisible();
  });

  test('step 2: with SoftAP mocks registered, step 2 shows connect instructions', async ({
    page,
    wifiPage,
  }) => {
    setupSoftApMocks(page, {
      particleId: 'particle_e2e_123',
      wifiNetworks: [
        { ch: 1, sec: 4194308, ssid: 'HomeWiFi' },
        { ch: 6, sec: 0, ssid: 'Guest' },
      ],
    });

    const { device } = await mockDeviceWithTaps(page, 0);
    await wifiPage.goto(String(device.id));

    await wifiPage.clickReady();

    await expect(page.getByTestId('wifi-setup-step2-content')).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByTestId('section-header-wifi-connect')).toBeVisible();
  });

  test('step 2 → step 3: when SoftAP APIs are mocked, app advances to network list', async ({
    page,
    wifiPage,
  }) => {
    setupSoftApMocks(page, {
      particleId: 'particle_e2e_456',
      wifiNetworks: [
        { ch: 1, sec: 4194308, ssid: 'SecuredNetwork' },
        { ch: 6, sec: 0, ssid: 'OpenNet' },
      ],
    });

    const { device } = await mockDeviceWithTaps(page, 0);
    await wifiPage.goto(String(device.id));

    await wifiPage.clickReady();

    await expect(page.getByTestId('wifi-setup-step2-content')).toBeVisible({
      timeout: 5000,
    });

    await expect(page.getByTestId('wifi-networks-list')).toBeVisible({
      timeout: 20000,
    });
    await expect(page.getByText('SecuredNetwork')).toBeVisible();
    await expect(page.getByText('OpenNet')).toBeVisible();
  });

  test('step 3: select network, enter password, connect advances to step 4', async ({
    page,
    wifiPage,
  }) => {
    setupSoftApMocks(page, {
      particleId: 'particle_e2e_789',
      wifiNetworks: [
        { ch: 1, sec: 4194308, ssid: 'SecuredNetwork' },
        { ch: 6, sec: 0, ssid: 'OpenNet' },
      ],
    });

    const { device } = await mockDeviceWithTaps(page, 0);
    await wifiPage.goto(String(device.id));

    await wifiPage.clickReady();

    await expect(page.getByTestId('wifi-networks-list')).toBeVisible({
      timeout: 20000,
    });

    await page.getByText('SecuredNetwork').first().click();

    const passwordInput = page
      .getByTestId('wifi-networks-list')
      .locator('input[type="password"]')
      .first();
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
    await passwordInput.fill('testpassword');

    await page
      .getByTestId('wifi-networks-list')
      .getByRole('button', { name: /connect/i })
      .first()
      .click();

    await expect(page.getByTestId('wifi-setup-step4-content')).toBeVisible({
      timeout: 15000,
    });
    await expect(
      page.getByTestId('section-header-wifi-setup-finish'),
    ).toBeVisible();
  });

  test('step 4: Continue button is visible after connect', async ({
    page,
    wifiPage,
  }) => {
    setupSoftApMocks(page);

    const { device } = await mockDeviceWithTaps(page, 0);
    await wifiPage.goto(String(device.id));

    await wifiPage.clickReady();
    await expect(page.getByTestId('wifi-networks-list')).toBeVisible({
      timeout: 20000,
    });

    await page.getByText('OpenNetwork').first().click();
    await page
      .getByTestId('wifi-networks-list')
      .getByRole('button', { name: /connect/i })
      .first()
      .click();

    await expect(page.getByTestId('wifi-setup-step4-content')).toBeVisible({
      timeout: 15000,
    });

    await expect(page.getByTestId('button-wifi-setup-continue')).toBeVisible();
  });

  test('forNewDevice: step 1 shows Particle ID input when expanded', async ({
    page,
  }) => {
    const { device } = await mockDeviceWithTaps(page, 0);
    await page.goto(`/devices/${device.id}/wifi-setup?forNewDevice=true`);

    await expect(page.getByTestId('wifi-setup-step1-content')).toBeVisible();
    await page.getByTestId('button-expand-particle-id').click();
    await expect(page.getByTestId('input-particleId')).toBeVisible();
  });

  test('forNewDevice: step 4 Continue redirects to devices/new with particleId when no returnTo', async ({
    page,
  }) => {
    const { device } = await mockDeviceWithTaps(page, 0);
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
    page,
  }) => {
    const { device, location } = await mockDeviceWithTaps(page, 0);

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
