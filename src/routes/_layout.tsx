import * as React from 'react';

import BrewskeyJSApi from '@brewskey/js-api';
import {
  QueryClientProvider,
  QueryErrorResetBoundary,
} from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from 'theme';

import { SnackBar } from '../common/SnackBar';
import { MainTabBarSlotProvider } from '../components/MainTabBar/MainTabBarSlot';
import {
  APP_SETTINGS_QUERY_KEY,
  AppSettingsProvider,
  loadAppSettingsFromStorage,
} from '../hooks/context/AppSettingsContext';
import {
  loadAuthStateFromStorage,
  setAuthSession,
  useAuthSession,
} from '../hooks/context/AuthContext';
import { PourProcessProvider } from '../hooks/context/PourProcessContext';
import { SnackBarProvider } from '../hooks/context/SnackBarContext';
import { queryClient } from '../utils/queryClient';

BrewskeyJSApi.initialize('https://brewskey.com');

// Hydrate auth state from Storage on app startup
const hydrateAuthState = async () => {
  try {
    const authState = await loadAuthStateFromStorage();
    if (authState) {
      setAuthSession(queryClient, authState);
    }
  } catch {
    // Ignore hydration errors
  }
};

// Hydrate app settings from Storage on app startup (after auth is hydrated)
const hydrateAppSettings = async () => {
  try {
    const appSettings = await loadAppSettingsFromStorage();
    // Always set query data, using default values if no stored settings found
    queryClient.setQueryData(
      APP_SETTINGS_QUERY_KEY,
      appSettings || {
        manageTapsEnabled: false,
        selectedOrganization: null,
      },
    );
  } catch {
    // Ignore hydration errors, set default values
    queryClient.setQueryData(APP_SETTINGS_QUERY_KEY, {
      manageTapsEnabled: false,
      selectedOrganization: null,
    });
  }
};

const RootLayoutNav = () => {
  const { data: authResponse, isLoading } = useAuthSession();

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!authResponse}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!authResponse}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};

export default function RootLayout() {
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    // Hydrate auth state first, then app settings
    const hydrate = async () => {
      await hydrateAuthState();
      await hydrateAppSettings();
      setIsHydrated(true);
    };
    hydrate();
  }, []);
  React.useEffect(() => {
    BrewskeyJSApi.setOnSessionUpdated((session, err) => {
      if (err) {
        console.error(err);
      }
      setAuthSession(queryClient, session ?? null);
    });
  }, []);

  if (!isHydrated) {
    // Return null or a loading screen while hydrating
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary2 }}>
      <QueryClientProvider client={queryClient}>
        <QueryErrorResetBoundary>
          <AppSettingsProvider>
            <SnackBarProvider>
              <PourProcessProvider>
                <MainTabBarSlotProvider>
                  <RootLayoutNav />
                  <SnackBar />
                </MainTabBarSlotProvider>
              </PourProcessProvider>
            </SnackBarProvider>
          </AppSettingsProvider>
        </QueryErrorResetBoundary>
      </QueryClientProvider>
    </SafeAreaView>
  );
}
