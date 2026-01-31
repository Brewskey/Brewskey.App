/**
 * Helper to set authentication data for Playwright tests
 * Sets auth data in window.__PLAYWRIGHT_AUTH_DATA__ which the app checks on load
 */

import { Page } from '@playwright/test';
import type { AuthResponse } from '@brewskey/js-api';
import type { AppSettings } from '../../src/hooks/context/AppSettingsContext';

/**
 * Sets auth data for Playwright tests
 * The app checks for __PLAYWRIGHT_AUTH_DATA__ in loadAuthStateFromStorage and uses it
 *
 * This function:
 * 1. Sets __PLAYWRIGHT_AUTH_DATA__ via addInitScript (runs before page loads)
 * 2. Sets it directly in Storage if available
 * 3. Sets up a navigation handler to persist it across navigations
 */
export async function setAuthStorage(
  page: Page,
  authResponse: AuthResponse,
): Promise<void> {
  // Set it in window via addInitScript - this runs before page loads
  // The app's loadAuthStateFromStorage checks for this and stores it in Storage
  await page.addInitScript((authData) => {
    (window as any).__PLAYWRIGHT_AUTH_DATA__ = authData;
  }, authResponse);

  // Function to set auth data in both window and Storage
  const setAuthData = async () => {
    try {
      await page.evaluate(async (authData) => {
        // Set in window
        (window as any).__PLAYWRIGHT_AUTH_DATA__ = authData;

        // Set directly in Storage if available
        if ((window as any).Storage) {
          try {
            await (window as any).Storage.setItem('session_data', authData);
          } catch (e) {
            // Storage might not be ready yet, but __PLAYWRIGHT_AUTH_DATA__ will handle it
          }
        }
      }, authResponse);
    } catch (e) {
      // Page might not be ready yet, but addInitScript will handle it
    }
  };

  // Set it immediately if page is already loaded
  await setAuthData();

  // Also set it on every navigation to ensure it persists
  page.on('framenavigated', setAuthData);
}

/**
 * Sets app settings for Playwright tests
 * Similar to setAuthStorage, sets app settings in window and Storage
 */
export async function setAppSettingsStorage(
  page: Page,
  appSettings: AppSettings,
): Promise<void> {
  // Set it in window via addInitScript - this runs before page loads
  await page.addInitScript((settings) => {
    (window as any).__PLAYWRIGHT_APP_SETTINGS__ = settings;
  }, appSettings);

  // Function to set app settings in both window and Storage
  const setAppSettings = async () => {
    try {
      await page.evaluate(async (settings) => {
        // Set in window
        (window as any).__PLAYWRIGHT_APP_SETTINGS__ = settings;

        // Set directly in Storage if available
        if ((window as any).Storage) {
          try {
            const userID = await (window as any).Storage.getUserID();
            if (userID) {
              await (window as any).Storage.setForCurrentUser(
                'app_settings',
                settings,
              );
            }
          } catch (e) {
            // Storage might not be ready yet, but __PLAYWRIGHT_APP_SETTINGS__ will handle it
          }
        }
      }, appSettings);
    } catch (e) {
      // Page might not be ready yet, but addInitScript will handle it
    }
  };

  // Set it immediately if page is already loaded
  await setAppSettings();

  // Also set it on every navigation to ensure it persists
  page.on('framenavigated', setAppSettings);
}
