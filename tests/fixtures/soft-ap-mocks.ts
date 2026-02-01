/**
 * Playwright route mocks for the Brewskey device SoftAP API (http://192.168.0.1:80).
 * Used by wifi-setup e2e tests so the app can run the full WiFi setup flow without
 * a real device.
 */

import { Page, Route } from '@playwright/test';

const SOFT_AP_BASE = 'http://192.168.0.1:80';
const SUCCESS_RESPONSE_CODE = 0;

/** Scan result item shape matching SoftApService translateWifiFromApi */
interface WifiScanItem {
  ch: number;
  sec: number;
  ssid: string;
}

export interface SoftApMockOptions {
  particleId?: string;
  wifiNetworks?: WifiScanItem[];
}

const defaultWifiNetworks: WifiScanItem[] = [
  { ch: 1, sec: 4194308, ssid: 'TestWiFi' },
  { ch: 6, sec: 0, ssid: 'OpenNetwork' },
  { ch: 11, sec: 4194310, ssid: 'OtherWPA2' },
];

/**
 * Minimal RSA 512-bit public key in PKCS#1 DER format (hex).
 * 22-byte prefix (device header) + DER key so SoftApService's slice(22) yields valid key.
 * Generated so NodeRSA can parse and encrypt (used by configureWifi).
 */
const MOCK_PUBLIC_KEY_HEX =
  '00'.repeat(22) +
  '305c300d06092a864886f70d0101010500034b003048024100' +
  'b3a0f7e0d1e9f4d1a0d1e9f4d1a0d1e9f4d1a0d1e9f4d1a0d1e9f4d1a0d1e9f4d1a0d1e9f4d1a0d1e9f4d1a0d1e9f4d1a0d1e9f4d1a0d1e9f4d1a0d1e9f4d1a0d1e9f4d1a0d1e90203010001';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Content-Length',
  'Access-Control-Allow-Private-Network': 'true',
};

function fulfillJSON(
  route: Route,
  status: number,
  body: Record<string, unknown>,
): Promise<void> {
  return route.fulfill({
    status,
    headers: CORS_HEADERS,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

/**
 * Registers route handlers that mock the device SoftAP API so the WiFi setup
 * flow (steps 2–4) can run without a real Brewskey box.
 * Call this before navigating to the wifi-setup screen in tests.
 */
export function setupSoftApMocks(
  page: Page,
  options: SoftApMockOptions = {},
): void {
  const particleId = options.particleId ?? 'particle_test_12345';
  const wifiNetworks = options.wifiNetworks ?? defaultWifiNetworks;

  const handleSoftAp = async (route: Route): Promise<void> => {
    const url = route.request().url();
    if (!url.startsWith(SOFT_AP_BASE)) {
      await route.continue();
      return;
    }

    const method = route.request().method();
    if (method === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: {
          ...CORS_HEADERS,
          'Access-Control-Max-Age': '86400',
        },
      });
      return;
    }

    const path = url.slice(SOFT_AP_BASE.length).replace(/\?.*$/, '');

    try {
      if (path === '/device-id' && method === 'GET') {
        await fulfillJSON(route, 200, { id: particleId });
        return;
      }

      if (path === '/scan-ap' && method === 'GET') {
        await fulfillJSON(route, 200, { scans: wifiNetworks });
        return;
      }

      if (path === '/public-key' && method === 'GET') {
        await fulfillJSON(route, 200, {
          r: SUCCESS_RESPONSE_CODE,
          b: MOCK_PUBLIC_KEY_HEX,
        });
        return;
      }

      if (path === '/configure-ap' && method === 'POST') {
        await fulfillJSON(route, 200, { r: SUCCESS_RESPONSE_CODE });
        return;
      }

      if (path === '/connect-ap' && method === 'POST') {
        await fulfillJSON(route, 200, { r: SUCCESS_RESPONSE_CODE });
        return;
      }

      await route.continue();
    } catch (e) {
      await route.abort();
    }
  };

  page.route(/192\.168\.0\.1/, handleSoftAp);
}
