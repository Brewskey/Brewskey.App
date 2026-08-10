/**
 * E2E coverage for the "Hidden network" sub-form rendered by HiddenWifiInput
 * inside the WiFi setup step 3 list.
 *
 * The form is its own isolated react-hook-form instance (it manages its own
 * state via `<Form>`), so these tests verify:
 *   - Collapsed by default; expand toggle reveals the form
 *   - Default security is OPEN (driven by DropdownInput's primitive-id contract)
 *   - Password field is conditionally shown only for non-OPEN security
 *   - Submitting an OPEN network sends a request with no encrypted password
 *   - Submitting a secured network sends ssid + selected security + a password
 */
import { expect, test } from '../../fixtures/test-fixtures';

import type { Request } from '@playwright/test';

test.use({ autoAuthenticate: true, seed: { devices: 1 } });

const WIFI_SECURITIES = {
  OPEN: 0,
  WPA2_AES_PSK: 4194308,
} as const;

test.describe('WiFi Setup - Hidden network form', () => {
  test.describe(() => {
    test.use({
      softAp: { particleId: 'particle_e2e_hidden_wifi', wifiNetworks: [] },
    });

    test('expand → defaults → conditional password → submit', async ({
      page,
      wifiPage,
      dropDown,
      devices,
    }) => {
      const [device] = devices;
      await wifiPage.goto(String(device.id));
      await wifiPage.clickReady();

      await test.step('step 3: network list renders with hidden-network toggle', async () => {
        await expect(page.getByTestId('wifi-networks-list')).toBeVisible({
          timeout: 20000,
        });
        await expect(
          page.getByTestId('button-expand-hidden-wifi'),
        ).toBeVisible();
      });

      await test.step('form is collapsed by default', async () => {
        await expect(page.getByTestId('hidden-wifi-form')).toHaveCount(0);
      });

      await test.step('expanding shows SSID input and security dropdown with OPEN default', async () => {
        await page.getByTestId('button-expand-hidden-wifi').click();

        await expect(page.getByTestId('hidden-wifi-form')).toBeVisible();
        await expect(page.getByTestId('input-hidden-wifi-ssid')).toBeVisible();
        await expect(
          page.getByTestId('hidden-wifi-security-dropdown'),
        ).toBeVisible();
        await expect(
          page.getByTestId('hidden-wifi-security-dropdown'),
        ).toContainText('OPEN');

        // Password field is hidden when security is OPEN
        await expect(
          page.getByTestId('input-hidden-wifi-password'),
        ).toHaveCount(0);
      });

      await test.step('selecting a secured network reveals password field', async () => {
        const securityDd = dropDown.create('hidden-wifi-security-dropdown');
        await securityDd.selectByLabel('WPA2_AES_PSK');

        await expect(
          page.getByTestId('input-hidden-wifi-password'),
        ).toBeVisible();
      });

      await test.step('switching back to OPEN hides the password field', async () => {
        const securityDd = dropDown.create('hidden-wifi-security-dropdown');
        await securityDd.selectByLabel('OPEN');

        await expect(
          page.getByTestId('input-hidden-wifi-password'),
        ).toHaveCount(0);
      });

      await test.step('submitting OPEN network sends ssid with sec=0 and no password', async () => {
        await page
          .getByTestId('input-hidden-wifi-ssid')
          .fill('MyHiddenOpenNetwork');

        const configurePromise = page.waitForRequest(
          (req: Request) =>
            req.url().includes('/configure-ap') && req.method() === 'POST',
          { timeout: 15000 },
        );

        await page.getByTestId('button-connect-hidden-wifi').click();

        const configureRequest = await configurePromise;
        const body = JSON.parse(configureRequest.postData() ?? '{}');
        expect(body.ssid).toBe('MyHiddenOpenNetwork');
        expect(body.sec).toBe(WIFI_SECURITIES.OPEN);
        expect(body.pwd).toBe('');
      });
    });
  });

  test.describe(() => {
    test.use({
      softAp: {
        particleId: 'particle_e2e_hidden_wifi_secured',
        wifiNetworks: [],
      },
    });

    test('submitting a secured hidden network sends ssid + security + encrypted password', async ({
      page,
      wifiPage,
      dropDown,
      devices,
    }) => {
      const [device] = devices;
      await wifiPage.goto(String(device.id));
      await wifiPage.clickReady();

      await expect(page.getByTestId('wifi-networks-list')).toBeVisible({
        timeout: 20000,
      });

      await page.getByTestId('button-expand-hidden-wifi').click();
      await expect(page.getByTestId('hidden-wifi-form')).toBeVisible();

      await page
        .getByTestId('input-hidden-wifi-ssid')
        .fill('MyHiddenSecuredNetwork');

      const securityDd = dropDown.create('hidden-wifi-security-dropdown');
      await securityDd.selectByLabel('WPA2_AES_PSK');

      await expect(
        page.getByTestId('input-hidden-wifi-password'),
      ).toBeVisible();
      await page.getByTestId('input-hidden-wifi-password').fill('s3cret-pwd');

      const configurePromise = page.waitForRequest(
        (req: Request) =>
          req.url().includes('/configure-ap') && req.method() === 'POST',
        { timeout: 15000 },
      );

      await page.getByTestId('button-connect-hidden-wifi').click();

      const configureRequest = await configurePromise;
      const body = JSON.parse(configureRequest.postData() ?? '{}');
      expect(body.ssid).toBe('MyHiddenSecuredNetwork');
      expect(body.sec).toBe(WIFI_SECURITIES.WPA2_AES_PSK);
      // Password is RSA-encrypted before being sent, so we just assert it's a
      // non-empty string distinct from the plaintext.
      expect(typeof body.pwd).toBe('string');
      expect(body.pwd.length).toBeGreaterThan(0);
      expect(body.pwd).not.toBe('s3cret-pwd');
    });
  });
});
