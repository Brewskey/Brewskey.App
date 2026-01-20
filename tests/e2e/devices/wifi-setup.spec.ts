import { test, expect } from '../../fixtures/test-fixtures';
import {
  mockWiFiNetworks,
  mockParticleDevice,
} from '../../fixtures/entity-fixtures';

test.use({ autoAuthenticate: true });

test('should display WiFi setup step 1', async ({ page, wifiPage }) => {
  // Set up explicit data: authenticated user (handled by autoAuthenticate)
  await wifiPage.goto();

  await expect(page).toHaveURL(/.*wifi.*setup/i);
  // Instructions text is dynamic content, so text-based locator is acceptable
  await expect(
    page.locator('text=/particle|device.*id|instructions/i'),
  ).toBeVisible();
});

test('should allow entering particle ID', async ({ page, wifiPage }) => {
  // Set up explicit data: particle device available
  const { id } = await mockParticleDevice(page);

  await wifiPage.goto();

  await wifiPage.fillParticleId(id);
  await expect(page.getByTestId('input-particleId')).toHaveValue(id);
});

test('should navigate through WiFi setup steps', async ({ page, wifiPage }) => {
  // Set up explicit data: WiFi networks available
  const networks = await mockWiFiNetworks(page);

  await wifiPage.goto();

  // Step 1: Enter particle ID
  await wifiPage.fillParticleId('particle_12345');
  await wifiPage.clickReady();

  // Step 2: Connection instructions - wait for step transition by checking for next step content
  await expect(
    page.locator('text=/connect|instructions/i'),
  ).toBeVisible();

  // Step 3: WiFi network selection - should be visible based on data setup
  const networkList = wifiPage.getWiFiNetworksList();
  await expect(networkList).toBeVisible();
  // Network SSID is dynamic content, so text-based locator is acceptable
  await wifiPage.selectWiFiNetwork(networks[0].ssid);
});

test('should complete WiFi setup', async ({ page, wifiPage }) => {
  // Set up explicit data: particle device and WiFi networks available
  const { id } = await mockParticleDevice(page);
  const networks = await mockWiFiNetworks(page);

  await wifiPage.goto();

  await wifiPage.fillParticleId(id);
  await wifiPage.clickReady();

  // Wait for step transition by checking for network list
  const networkList = wifiPage.getWiFiNetworksList();
  await expect(networkList).toBeVisible();

  // Network SSID is dynamic content, so text-based locator is acceptable
  await wifiPage.selectWiFiNetwork(networks[0].ssid);
  await wifiPage.fillWiFiPassword('testpassword');
  await wifiPage.submitWiFiSetup();
  
  // Wait for success by checking for success message or redirect
  await expect(
    page.locator('text=/success|connected|complete/i').or(page.getByRole('heading', { name: /success/i }))
  ).toBeVisible();
});
