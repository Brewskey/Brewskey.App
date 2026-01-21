/**
 * Manual navigation test script
 * Tests the app at localhost:8081 with real API calls to brewskey.com
 * Monitors for HTTP errors (400s/500s) on GET requests
 */

import { chromium, Browser, Page } from 'playwright';

const APP_URL = 'http://localhost:8081';
const USERNAME = 'test';
const PASSWORD = 'password';

// Coordinates for 7321 13th Ave NW, Seattle, WA 98117
const TEST_LOCATION = {
  latitude: 47.680597,
  longitude: -122.380422,
  accuracy: 10,
};

interface FailedRequest {
  url: string;
  status: number;
  method: string;
  timestamp: number;
  responseText?: string;
}

const failedRequests: FailedRequest[] = [];

interface RoutingError {
  url: string;
  error: string;
  timestamp: number;
}

const routingErrors: RoutingError[] = [];

async function setupPageMonitoring(page: Page) {
  // Monitor all network requests
  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('brewskey.com')) {
      console.log(`[REQUEST] ${request.method()} ${url}`);
    }
  });

  page.on('response', async (response) => {
    const url = response.url();
    const status = response.status();
    const method = response.request().method();

    if (url.includes('brewskey.com')) {
      if (status >= 400) {
        let responseText = '';
        try {
          responseText = await response.text();
        } catch (e) {
          responseText = 'Could not read response';
        }

        // Track GET requests with 400+ status codes
        // Exclude:
        // - 401: Authorization issues (user doesn't have permission)
        // - 400 on cloud-devices: Invalid device IDs (expected for some devices)
        const isCloudDevice400 = url.includes('/cloud-devices/') && status === 400;
        if (method === 'GET' && status >= 400 && status !== 401 && !isCloudDevice400) {
          failedRequests.push({
            url,
            status,
            method,
            timestamp: Date.now(),
            responseText: responseText.substring(0, 500), // First 500 chars
          });
        }

        console.log(`[ERROR] ${status} ${method} ${url}`);
        if (responseText) {
          console.log(`  Response: ${responseText.substring(0, 200)}`);
        }
      } else {
        console.log(`[SUCCESS] ${status} ${method} ${url}`);
      }
    }
  });

  // Monitor for routing errors in console
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      // Check for common routing error patterns
      if (text.includes('route') || text.includes('navigation') || 
          text.includes('404') || text.includes('not found') ||
          text.includes('Cannot read') && text.includes('route')) {
        routingErrors.push({
          url: page.url(),
          error: text,
          timestamp: Date.now(),
        });
        console.log(`[ROUTING ERROR] ${text}`);
      }
    }
  });

  // Monitor for page errors
  page.on('pageerror', error => {
    const errorMessage = error.message || String(error);
    if (errorMessage.includes('route') || errorMessage.includes('navigation') ||
        errorMessage.includes('404') || errorMessage.includes('not found')) {
      routingErrors.push({
        url: page.url(),
        error: errorMessage,
        timestamp: Date.now(),
      });
      console.log(`[PAGE ERROR] ${errorMessage}`);
    }
  });
}

async function login(page: Page): Promise<boolean> {
  try {
    console.log('Navigating to login page...');
    await page.goto(`${APP_URL}/`, { waitUntil: 'networkidle' });
    
    // Wait a bit for React to render
    await page.waitForTimeout(2000);

    // Wait for login form - try multiple selectors
    console.log('Waiting for login form...');
    try {
      await page.getByTestId('login-username-input').waitFor({ timeout: 15000 });
    } catch (e) {
      // Try alternative selectors
      console.log('Primary selector failed, trying alternatives...');
      const altSelectors = [
        '[data-testid="login-username-input"]',
        '[testid="login-username-input"]',
        'input[placeholder*="User name" i]',
        'input[placeholder*="username" i]',
      ];
      
      let found = false;
      for (const selector of altSelectors) {
        try {
          await page.waitForSelector(selector, { timeout: 3000 });
          console.log(`Found element with selector: ${selector}`);
          found = true;
          break;
        } catch {
          // Continue to next selector
        }
      }
      
      if (!found) {
        // Take screenshot for debugging
        await page.screenshot({ path: 'login-debug.png' });
        console.log('Screenshot saved to login-debug.png');
        console.log('Page HTML:', await page.content());
        throw new Error('Could not find login username input');
      }
    }

    console.log('Filling in credentials...');
    await page.getByTestId('login-username-input').fill(USERNAME);
    await page.getByTestId('login-password-input').fill(PASSWORD);

    console.log('Clicking login button...');
    await page.getByTestId('login-submit-button').click();

    // Wait for navigation or error - check multiple times
    let loginSuccess = false;
    const initialUrl = page.url();
    
    for (let i = 0; i < 15; i++) {
      await page.waitForTimeout(1000);
      const currentUrl = page.url();
      console.log(`Check ${i + 1}: Current URL: ${currentUrl}`);
      
      // Check if we navigated away from login page
      // After successful login, we should be redirected to /(tabs) which might be /, /home, /taps, etc.
      const isStillOnLogin = currentUrl.includes('/login');
      
      // Also check if login form is still visible
      const loginFormVisible = await page.getByTestId('login-form').isVisible().catch(() => false);
      
      // If we're not on login page and login form is not visible, login succeeded
      if (!isStillOnLogin && !loginFormVisible) {
        loginSuccess = true;
        console.log(`Login successful! Navigated to: ${currentUrl}`);
        break;
      }
      
      // Check for error message
      const errorMessage = await page.getByTestId('login-error-message').textContent().catch(() => null);
      if (errorMessage && errorMessage.trim()) {
        console.log(`Login failed: ${errorMessage}`);
        return false;
      }
      
      // If URL changed from initial URL and we're not on login, likely success
      if (currentUrl !== initialUrl && !isStillOnLogin) {
        loginSuccess = true;
        console.log(`Login successful! URL changed from ${initialUrl} to ${currentUrl}`);
        break;
      }
    }

    if (!loginSuccess) {
      // Final check for error message
      const errorMessage = await page.getByTestId('login-error-message').textContent().catch(() => null);
      if (errorMessage && errorMessage.trim()) {
        console.log(`Login failed: ${errorMessage}`);
      } else {
        console.log('Login failed - still on login page after 15 seconds');
        console.log(`Final URL: ${page.url()}`);
        // Take screenshot for debugging
        await page.screenshot({ path: 'login-timeout.png' });
      }
      return false;
    }

    // Wait a bit more for the app to fully load after login
    await page.waitForTimeout(2000);
    console.log(`Final URL after login: ${page.url()}`);
    return true;
  } catch (error) {
    console.error('Login error:', error);
    await page.screenshot({ path: 'login-error.png' });
    return false;
  }
}

async function enableLocationPermissions(page: Page) {
  try {
    console.log('\n=== Enabling Location Permissions ===\n');
    
    // Set geolocation in browser context
    await page.context().grantPermissions(['geolocation'], { origin: APP_URL });
    await page.context().setGeolocation({
      latitude: TEST_LOCATION.latitude,
      longitude: TEST_LOCATION.longitude,
    });
    
    // Mock Expo Location API to return our test coordinates
    await page.addInitScript((location) => {
      if (typeof window !== 'undefined') {
        // Mock expo-location module
        const mockLocation = {
          getForegroundPermissionsAsync: async () => ({
            status: 'granted' as const,
            granted: true,
            canAskAgain: true,
            expires: 'never' as const,
          }),
          requestForegroundPermissionsAsync: async () => ({
            status: 'granted' as const,
            granted: true,
            canAskAgain: true,
            expires: 'never' as const,
          }),
          getCurrentPositionAsync: async () => ({
            coords: {
              latitude: location.latitude,
              longitude: location.longitude,
              accuracy: location.accuracy,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: Date.now(),
          }),
        };
        
        // Store mock in window for expo-location to use
        (window as any).__EXPO_LOCATION_MOCK__ = mockLocation;
        
        // Also mock navigator.geolocation for compatibility
        const mockGetCurrentPosition: Geolocation['getCurrentPosition'] = (
          success: PositionCallback,
          error?: PositionErrorCallback,
        ) => {
          success({
            coords: {
              latitude: location.latitude,
              longitude: location.longitude,
              accuracy: location.accuracy,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: Date.now(),
          } as GeolocationPosition);
        };
        Object.assign(navigator.geolocation, { getCurrentPosition: mockGetCurrentPosition });
      }
    }, TEST_LOCATION);
    
    // Navigate to home
    await page.goto(`${APP_URL}/`);

    // Check if permission button exists
    const permissionButton = page.getByTestId('button-provide-permissions');
    const isVisible = await permissionButton.isVisible().catch(() => false);
    
    if (isVisible) {
      console.log('Clicking "Provide permissions" button...');
      await permissionButton.click();
      console.log('Location permissions granted');
    } else {
      console.log('Location permissions already granted or not needed');
    }
  } catch (error) {
    console.error('Error enabling location permissions:', error);
  }
}

async function navigateToSettings(page: Page) {
  try {
    console.log('\n=== Navigating to Settings ===\n');
    
    // Try direct navigation first
    console.log('Navigating directly to settings...');
    await page.goto(`${APP_URL}/menu/settings`);
    
    // Check if we're on settings page
    const currentUrl = page.url();
    if (currentUrl.includes('/settings')) {
      console.log('Successfully navigated to settings');
      return true;
    }
    
    // If direct navigation didn't work, try via menu
    console.log('Direct navigation failed, trying via menu...');
    await page.goto(`${APP_URL}/menu`);

    // Try to find and click settings button
    try {
      // Try multiple ways to find the button
      const settingsButton = page.getByTestId('header-settings-button');
      const isVisible = await settingsButton.isVisible({ timeout: 5000 });
      
      if (isVisible) {
        console.log('Found settings button, clicking...');
        await settingsButton.click();
        
        const newUrl = page.url();
        if (newUrl.includes('/settings')) {
          console.log('Successfully navigated to settings via button');
          return true;
        }
      }
    } catch (e) {
      console.log('Could not find settings button:', e);
    }
    
    return false;
  } catch (error) {
    console.error('Error navigating to settings:', error);
    return false;
  }
}

async function toggleManageTaps(page: Page) {
  try {
    console.log('\n=== Toggling Manage Taps ===\n');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Debug: Check current URL
    const currentUrl = page.url();
    console.log(`Current URL: ${currentUrl}`);
    
    // Wait for the settings page to be visible
    await page.waitForSelector('[data-testid="header-settings"], [testid="header-settings"]', { timeout: 5000 }).catch(() => {
      console.log('Settings header not found, but continuing...');
    });
    
    // Approach 1: Try using Playwright's getByTestId (handles data-testid automatically)
    console.log('Looking for switch-manage-taps using getByTestId...');
    try {
      const listItem = page.getByTestId('switch-manage-taps');
      await listItem.waitFor({ timeout: 5000 });
      await listItem.scrollIntoViewIfNeeded();
      await listItem.click({ timeout: 3000 });
      console.log('Manage taps toggled successfully (via getByTestId)');
      await page.waitForTimeout(1000); // Wait for state to update
      return true;
    } catch (e) {
      console.log('getByTestId failed, trying alternatives...');
    }
    
    // Approach 2: Find by text (most reliable for React Native Web)
    console.log('Looking for "Manage taps" text...');
    try {
      const manageTapsText = page.getByText('Manage taps', { exact: false });
      await manageTapsText.waitFor({ timeout: 5000 });
      await manageTapsText.scrollIntoViewIfNeeded();
      
      // Try clicking the text element itself
      try {
        await manageTapsText.click({ force: true, timeout: 3000 });
        console.log('Manage taps toggled successfully (via text click)');
        await page.waitForTimeout(1000);
        return true;
      } catch (clickError) {
        console.log('Text click failed, trying to find switch element...');
        // Try to find the switch element
        const switchElement = page.locator('input[type="checkbox"], [role="switch"]').first();
        const switchCount = await switchElement.count();
        if (switchCount > 0) {
          await switchElement.click({ force: true });
          console.log('Manage taps toggled successfully (via switch element)');
          await page.waitForTimeout(1000);
          return true;
        }
      }
    } catch (e) {
      console.log('Text-based approach failed');
    }
    
    // Approach 3: Try direct selectors
    console.log('Trying direct selectors...');
    const selectors = [
      '[data-testid="switch-manage-taps"]',
      '[testid="switch-manage-taps"]',
      '[data-testid="switch-manage-taps-switch"]',
      '[testid="switch-manage-taps-switch"]',
    ];
    
    for (const selector of selectors) {
      try {
        const element = page.locator(selector);
        const count = await element.count();
        if (count > 0) {
          console.log(`Found element with selector: ${selector}`);
          await element.scrollIntoViewIfNeeded();
          await element.click({ force: true, timeout: 3000 });
          console.log('Manage taps toggled successfully');
          await page.waitForTimeout(1000);
          return true;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    console.log('Could not toggle manage taps - element not found');
    // Take screenshot for debugging
    await page.screenshot({ path: 'manage-taps-debug.png' });
    return false;
  } catch (error) {
    console.error('Error toggling manage taps:', error);
    await page.screenshot({ path: 'manage-taps-error.png' });
    return false;
  }
}

async function testDynamicRoutes(page: Page) {
  console.log('\n=== Testing Dynamic Routes ===\n');
  
  try {
    // Try to navigate to detail pages by clicking on list items
    // First, go to locations and try to click a location
    console.log('Testing location detail routes...');
    await page.goto(`${APP_URL}/locations`);
    await page.waitForTimeout(2000);
    
    // Wait for list to load
    try {
      await page.getByTestId('locations-list').waitFor({ timeout: 5000 });
    } catch (e) {
      console.log('  ⚠ Locations list not found, skipping...');
    }
    
    // Try to find and click a location item using testID pattern
    const locationItems = await page.locator('[data-testid^="location-item-"]').all();
    if (locationItems.length > 0) {
      try {
        console.log(`  Found ${locationItems.length} location items, clicking first...`);
        await locationItems[0].click({ timeout: 3000 });
        await page.waitForTimeout(2000);
        const url = page.url();
        if (url.includes('/locations/')) {
          console.log(`  ✓ Successfully navigated to location detail: ${url}`);
          const check = await verifyPageRenders(page, url.replace(APP_URL, ''));
          routeChecks.push(check);
        } else {
          console.log(`  ⚠ Clicked location but URL didn't change: ${url}`);
        }
      } catch (e) {
        console.log(`  ✗ Could not click location item: ${e}`);
      }
    } else {
      console.log('  ⚠ No location items found');
    }
    
    // Try taps detail
    console.log('\nTesting tap detail routes...');
    await page.goto(`${APP_URL}/taps`);
    await page.waitForTimeout(2000);
    
    // Wait for list to load
    try {
      await page.getByTestId('taps-list').waitFor({ timeout: 5000 });
    } catch (e) {
      console.log('  ⚠ Taps list not found, skipping...');
    }
    
    const tapItems = await page.locator('[data-testid^="tap-item-"]').all();
    if (tapItems.length > 0) {
      try {
        console.log(`  Found ${tapItems.length} tap items, clicking first...`);
        await tapItems[0].click({ timeout: 3000 });
        await page.waitForTimeout(2000);
        const url = page.url();
        if (url.includes('/taps/')) {
          console.log(`  ✓ Successfully navigated to tap detail: ${url}`);
          const check = await verifyPageRenders(page, url.replace(APP_URL, ''));
          routeChecks.push(check);
          
          // Try navigating to tap sub-routes
          const tapSubRoutes = ['/stats', '/leaderboard', '/keg', '/on_tap'];
          for (const subRoute of tapSubRoutes) {
            try {
              const fullUrl = url + subRoute;
              await page.goto(fullUrl);
              await page.waitForTimeout(2000);
              const check = await verifyPageRenders(page, fullUrl.replace(APP_URL, ''));
              routeChecks.push(check);
            } catch (e) {
              console.log(`  ✗ Could not navigate to ${subRoute}: ${e}`);
            }
          }
        } else {
          console.log(`  ⚠ Clicked tap but URL didn't change: ${url}`);
        }
      } catch (e) {
        console.log(`  ✗ Could not click tap item: ${e}`);
      }
    } else {
      console.log('  ⚠ No tap items found');
    }
    
    // Try devices detail
    console.log('\nTesting device detail routes...');
    await page.goto(`${APP_URL}/devices`);
    await page.waitForTimeout(2000);
    
    // Wait for list to load
    try {
      await page.getByTestId('devices-list').waitFor({ timeout: 5000 });
    } catch (e) {
      console.log('  ⚠ Devices list not found, skipping...');
    }
    
    const deviceItems = await page.locator('[data-testid^="device-item-"]').all();
    if (deviceItems.length > 0) {
      try {
        console.log(`  Found ${deviceItems.length} device items, clicking first...`);
        await deviceItems[0].click({ timeout: 3000 });
        await page.waitForTimeout(2000);
        const url = page.url();
        if (url.includes('/devices/')) {
          console.log(`  ✓ Successfully navigated to device detail: ${url}`);
          const check = await verifyPageRenders(page, url.replace(APP_URL, ''));
          routeChecks.push(check);
        } else {
          console.log(`  ⚠ Clicked device but URL didn't change: ${url}`);
        }
      } catch (e) {
        console.log(`  ✗ Could not click device item: ${e}`);
      }
    } else {
      console.log('  ⚠ No device items found');
    }
    
    // Try beverages detail
    console.log('\nTesting beverage detail routes...');
    await page.goto(`${APP_URL}/beverages`);
    await page.waitForTimeout(2000);
    
    // Wait for list to load
    try {
      await page.getByTestId('beverages-list').waitFor({ timeout: 5000 });
    } catch (e) {
      console.log('  ⚠ Beverages list not found, skipping...');
    }
    
    // Beverages might not have testIDs yet, try both approaches
    const beverageItems = await page.locator('[data-testid^="beverage-item-"], [data-testid*="beverage"]').all();
    if (beverageItems.length > 0) {
      try {
        console.log(`  Found ${beverageItems.length} beverage items, clicking first...`);
        await beverageItems[0].click({ timeout: 3000 });
        await page.waitForTimeout(2000);
        const url = page.url();
        if (url.includes('/beverages/')) {
          console.log(`  ✓ Successfully navigated to beverage detail: ${url}`);
          const check = await verifyPageRenders(page, url.replace(APP_URL, ''));
          routeChecks.push(check);
        } else {
          console.log(`  ⚠ Clicked beverage but URL didn't change: ${url}`);
        }
      } catch (e) {
        console.log(`  ✗ Could not click beverage item: ${e}`);
      }
    } else {
      console.log('  ⚠ No beverage items found');
    }
    
    // Try pours detail (from stats page)
    console.log('\nTesting pour detail routes...');
    await page.goto(`${APP_URL}/stats`);
    await page.waitForTimeout(2000);
    
    const pourItems = await page.locator('[data-testid^="pour-item-"]').all();
    if (pourItems.length > 0) {
      try {
        console.log(`  Found ${pourItems.length} pour items, clicking first...`);
        await pourItems[0].click({ timeout: 3000 });
        await page.waitForTimeout(2000);
        const url = page.url();
        console.log(`  Navigated to: ${url}`);
        // Pours might navigate to profile pages
        if (url.includes('/profile/') || url.includes('/beverages/')) {
          console.log(`  ✓ Successfully navigated via pour: ${url}`);
          const check = await verifyPageRenders(page, url.replace(APP_URL, ''));
          routeChecks.push(check);
        }
      } catch (e) {
        console.log(`  ✗ Could not click pour item: ${e}`);
      }
    } else {
      console.log('  ⚠ No pour items found');
    }
    
  } catch (error) {
    console.error('Error testing dynamic routes:', error);
  }
}

async function testNavigationFlow(page: Page) {
  console.log('\n=== Testing Navigation Flow ===\n');
  
  try {
    // Test menu navigation
    console.log('Testing menu navigation...');
    await page.goto(`${APP_URL}/menu`);
    await page.waitForTimeout(2000);
    
    const menuItems = [
      { testId: 'menu-item-friends', route: '/menu/my-friends' },
      { testId: 'menu-item-locations', route: '/locations' },
      { testId: 'menu-item-taps', route: '/taps' },
      { testId: 'menu-item-devices', route: '/devices' },
      { testId: 'menu-item-beverages', route: '/beverages' },
      { testId: 'menu-item-help', route: '/menu/help' },
    ];
    
    for (const item of menuItems) {
      try {
        const button = page.getByTestId(item.testId);
        const isVisible = await button.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (isVisible) {
          const text = await button.textContent().catch(() => '');
          console.log(`  Clicking ${text || item.testId}...`);
          await button.click();
          await page.waitForTimeout(2000);
          
          const currentUrl = page.url();
          if (currentUrl.includes(item.route.split('/').pop() || '')) {
            console.log(`    ✓ Navigated to ${currentUrl}`);
          } else {
            console.log(`    ✗ Expected route containing ${item.route}, got ${currentUrl}`);
          }
          
          // Go back to menu
          await page.goto(`${APP_URL}/menu`);
          await page.waitForTimeout(1000);
        }
      } catch (e) {
        console.log(`  ✗ Error clicking ${item.testId}: ${e}`);
      }
    }
    
    // Test header navigation buttons
    console.log('\nTesting header navigation...');
    await page.goto(`${APP_URL}/menu`);
    await page.waitForTimeout(2000);
    
    try {
      const settingsButton = page.getByTestId('header-settings-button');
      const isVisible = await settingsButton.isVisible({ timeout: 2000 }).catch(() => false);
      if (isVisible) {
        console.log('  Clicking settings button...');
        await settingsButton.click();
        await page.waitForTimeout(2000);
        const url = page.url();
        if (url.includes('/settings')) {
          console.log(`    ✓ Navigated to settings: ${url}`);
        }
      }
    } catch (e) {
      console.log(`  ✗ Could not find settings button: ${e}`);
    }
    
  } catch (error) {
    console.error('Error testing navigation flow:', error);
  }
}

interface RouteCheck {
  route: string;
  success: boolean;
  error?: string;
  rendered: boolean;
  hasHeader?: boolean;
  hasContent?: boolean;
}

const routeChecks: RouteCheck[] = [];

async function verifyPageRenders(page: Page, route: string): Promise<RouteCheck> {
  const check: RouteCheck = {
    route,
    success: false,
    rendered: false,
  };

  try {
    console.log(`  Navigating to ${route}...`);
    await page.goto(`${APP_URL}${route}`, { waitUntil: 'networkidle', timeout: 10000 });
    
    // Wait for React to render
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    check.success = currentUrl.includes(route.split('?')[0]) || currentUrl === `${APP_URL}${route}`;
    
    if (!check.success) {
      check.error = `Expected URL to contain ${route}, got ${currentUrl}`;
      return check;
    }

    // Check for common page elements that indicate rendering
    // Look for headers, containers, or main content areas
    const hasHeader = await page.locator('[data-testid*="header"], [testid*="header"], header, [role="banner"]').count().then(count => count > 0).catch(() => false);
    const hasContainer = await page.locator('[data-testid*="container"], [testid*="container"], main, [role="main"]').count().then(count => count > 0).catch(() => false);
    const hasText = await page.locator('body').textContent().then(text => text && text.trim().length > 50).catch(() => false);
    
    check.hasHeader = Boolean(hasHeader);
    check.hasContent = Boolean(hasContainer || hasText);
    check.rendered = Boolean(hasHeader || hasContainer || hasText);
    
    // Check for error messages or error screens
    const hasError = await page.locator('text=/error|404|not found|routing error/i').count().then(count => count > 0).catch(() => false);
    if (hasError) {
      const errorText = await page.locator('text=/error|404|not found|routing error/i').first().textContent().catch(() => 'Unknown error');
      check.error = `Page shows error: ${errorText}`;
      check.rendered = false;
    }

    // Check console for errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    if (check.rendered) {
      console.log(`    ✓ Page rendered (header: ${hasHeader}, content: ${check.hasContent})`);
    } else {
      console.log(`    ✗ Page may not have rendered properly`);
      await page.screenshot({ path: `route-error-${route.replace(/\//g, '-')}.png` });
    }

  } catch (error: any) {
    check.error = error.message || String(error);
    console.log(`    ✗ Error: ${check.error}`);
    await page.screenshot({ path: `route-error-${route.replace(/\//g, '-')}.png` });
  }

  return check;
}

async function navigateApp(page: Page) {
  console.log('\n=== Navigating and Verifying Routes ===\n');

  // Main tab routes
  const mainRoutes = [
    '/',
    '/taps',
    '/locations',
    '/devices',
    '/beverages',
    '/menu',
    '/stats',
    '/notifications',
  ];

  for (const route of mainRoutes) {
    const check = await verifyPageRenders(page, route);
    routeChecks.push(check);
    await page.waitForTimeout(1000); // Brief pause between routes
  }

  // Menu sub-routes
  const menuRoutes = [
    '/menu/help',
    '/menu/settings',
    '/menu/my-profile',
    '/menu/payments',
    '/menu/write-nfc',
  ];

  for (const route of menuRoutes) {
    const check = await verifyPageRenders(page, route);
    routeChecks.push(check);
    await page.waitForTimeout(1000);
  }

  // Try to navigate to list pages and check if we can see items
  console.log('\n=== Checking List Pages ===\n');
  
  // Check taps list
  await page.goto(`${APP_URL}/taps`);
  await page.waitForTimeout(2000);
  const tapsList = await page.getByTestId('taps-list').isVisible().catch(() => false);
  console.log(`  Taps list visible: ${tapsList}`);
  
  // Check locations list
  await page.goto(`${APP_URL}/locations`);
  await page.waitForTimeout(2000);
  const locationsList = await page.getByTestId('locations-list').isVisible().catch(() => false);
  console.log(`  Locations list visible: ${locationsList}`);
  
  // Check devices list
  await page.goto(`${APP_URL}/devices`);
  await page.waitForTimeout(2000);
  const devicesList = await page.getByTestId('devices-list').isVisible().catch(() => false);
  console.log(`  Devices list visible: ${devicesList}`);
  
  // Check beverages list
  await page.goto(`${APP_URL}/beverages`);
  await page.waitForTimeout(2000);
  const beveragesList = await page.getByTestId('beverages-list').isVisible().catch(() => false);
  console.log(`  Beverages list visible: ${beveragesList}`);
}

async function main() {
  console.log('Starting manual navigation test...\n');
  console.log(`App URL: ${APP_URL}`);
  console.log(`Username: ${USERNAME}\n`);

  const browser = await chromium.launch({
    headless: false, // Show browser for debugging
  });

  try {
    const context = await browser.newContext({
      geolocation: {
        latitude: TEST_LOCATION.latitude,
        longitude: TEST_LOCATION.longitude,
      },
      permissions: ['geolocation'],
    });
    const page = await context.newPage();

    // Set up monitoring
    setupPageMonitoring(page);
    
    // Enable location permissions before login
    await enableLocationPermissions(page);

    // Login
    const loginSuccess = await login(page);
    if (!loginSuccess) {
      console.log('\nLogin failed. Cannot continue with navigation test.');
      console.log('\nFailed Requests:', failedRequests);
      await browser.close();
      return;
    }

    // Navigate around and verify routes
    await navigateApp(page);

    // Test dynamic routes and nested navigation
    await testDynamicRoutes(page);

    // Test navigation flow through menu and headers
    await testNavigationFlow(page);

    // Navigate to settings and toggle manage taps
    const settingsNavigated = await navigateToSettings(page);
    if (settingsNavigated) {
      await toggleManageTaps(page);
      // Navigate again after toggling to see if more features are available
      await navigateApp(page);
    }

    // Report results
    console.log('\n=== Test Results ===\n');
    
    // Route verification results
    console.log('=== Route Verification Results ===\n');
    const successfulRoutes = routeChecks.filter(r => r.success && r.rendered);
    const failedRoutes = routeChecks.filter(r => !r.success || !r.rendered);
    
    console.log(`✅ Successfully rendered: ${successfulRoutes.length}/${routeChecks.length} routes`);
    if (failedRoutes.length > 0) {
      console.log(`\n❌ Failed routes:\n`);
      failedRoutes.forEach((check) => {
        console.log(`  ${check.route}`);
        if (check.error) {
          console.log(`    Error: ${check.error}`);
        }
        if (!check.rendered) {
          console.log(`    Page did not render properly`);
        }
      });
    }
    
    // Routing errors
    console.log('\n=== Routing Error Results ===\n');
    if (routingErrors.length === 0) {
      console.log('✅ No routing errors detected');
    } else {
      console.log(`❌ Found ${routingErrors.length} routing errors:\n`);
      routingErrors.forEach((err, index) => {
        console.log(`${index + 1}. ${err.url}`);
        console.log(`   Error: ${err.error}`);
        console.log('');
      });
    }
    
    // HTTP errors
    console.log('\n=== HTTP Error Results ===\n');
    if (failedRequests.length === 0) {
      console.log('✅ No HTTP errors (400/500) found on GET requests to brewskey.com');
      console.log('   (Note: 401 authorization errors are excluded as they may be expected)');
    } else {
      console.log(`❌ Found ${failedRequests.length} failed GET requests (400/500):\n`);
      failedRequests.forEach((req, index) => {
        console.log(`${index + 1}. ${req.status} ${req.method} ${req.url}`);
        if (req.responseText) {
          console.log(`   Response: ${req.responseText.substring(0, 200)}...`);
        }
        console.log('');
      });
    }

    await browser.close();
  } catch (error) {
    console.error('Test error:', error);
    await browser.close();
    process.exit(1);
  }
}

main().catch(console.error);
