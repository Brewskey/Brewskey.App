import * as React from 'react';

import * as Updates from 'expo-updates';
import { AppState } from 'react-native';

import type { AppStateStatus } from 'react-native';

/**
 * Matches “Example: Check for updates manually” in
 * https://docs.expo.dev/versions/latest/sdk/updates/ — the app is configured
 * with `checkAutomatically: "NEVER"` so the default on-launch check is off and
 * we run updates from JS, then `reloadAsync()` as soon as a new bundle (or
 * server-directed rollback) is fetched.
 */
async function fetchAndReloadUpdateAsync() {
  if (!Updates.isEnabled) {
    return;
  }
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
      return;
    }
    if ('isRollBackToEmbedded' in update && update.isRollBackToEmbedded) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch {
    // Offline, throttling, or missing EAS config — keep the current bundle.
  }
}

export function useEASUpdateAutoReload() {
  React.useEffect(() => {
    if (__DEV__) {
      return undefined;
    }
    const run = () => {
      void fetchAndReloadUpdateAsync();
    };
    run();
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        run();
      }
    });
    return () => {
      sub.remove();
    };
  }, []);
}
