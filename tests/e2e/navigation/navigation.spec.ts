import { test, expect } from '../../fixtures/test-fixtures';

test.describe('authenticated', () => {
  test.use({ autoAuthenticate: true });

  test('should navigate between bottom tabs', async ({ page }) => {
    // Home tab
    await page.goto('/');

    // Home route may be at root or /home - check pathname
    const url = new URL(page.url());
    expect(url.pathname === '/' || url.pathname.includes('home')).toBeTruthy();

    // Stats tab has testID - use that instead of text-based locator
    const statsTab = page.getByTestId('tab-stats');
    await expect(statsTab).toBeVisible();
    await statsTab.click();
    // Expo Router may keep URL at / when switching tabs; assert on stats content
    await expect(page.getByTestId('badges-section')).toBeVisible();

    // Notifications tab has testID - use that instead of text-based locator
    const notificationsTab = page.getByTestId('tab-notifications');
    await expect(notificationsTab).toBeVisible();
    await notificationsTab.click();
    await expect(
      page.getByTestId('button-delete-all-notifications'),
    ).toBeVisible();

    // Menu tab has testID - use that instead of text-based locator
    const menuTab = page.getByTestId('tab-menu');
    await expect(menuTab).toBeVisible();
    await menuTab.click();
    await expect(page.getByTestId('menu-user-block')).toBeVisible();
  });

  test.describe('with one device', () => {
    test.use({ seed: { devices: 1 } });

    test('should navigate back from detail screens', async ({
      page,
      devices,
    }) => {
      // Device details works, location details is blocked
      const [device] = devices;

      await page.goto('/devices');

      // Device item has testID
      await expect(page.getByTestId(`device-item-${device.id}`)).toBeVisible();
      await page.getByTestId(`device-item-${device.id}`).click();

      // Wait for device details page to load
      await expect(page.getByTestId('overview-item-box-id')).toBeVisible();

      // Use browser back navigation to test navigation works
      await page.goBack();
      await expect(page).toHaveURL(/.*devices/i);
    });
  });

  test.describe('with one tap', () => {
    test.use({ seed: { taps: 1 } });

    test('should handle deep linking', async ({ page, taps }) => {
      const [tap] = taps;

      // Deep link straight to the real tap's detail page
      await page.goto(`/taps/${tap.id}`);

      await expect(page).toHaveURL(new RegExp(`taps.*${tap.id}`, 'i'));
    });
  });
});

test('should redirect to login when signed out', async ({ page }) => {
  // No authenticated user
  await page.goto('/');

  // Should redirect to login
  await expect(page).toHaveURL(/.*login/i);
});
