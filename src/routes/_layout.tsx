import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BrewskeyJSApi, { AuthResponse } from '@brewskey/js-api';
import { AUTH_QUERY_KEY, loadAuthStateFromStorage, saveAuthStateToStorage, setAuthSession } from '../hooks/context/AuthContext';
import { APP_SETTINGS_QUERY_KEY, loadAppSettingsFromStorage } from '../hooks/context/AppSettingsContext';
import { SnackBar } from '../common/SnackBar';
import { SnackBarProvider } from '../hooks/context/SnackBarContext';
import { PourProcessProvider } from '../hooks/context/PourProcessContext';
import { AppSettingsProvider } from '../hooks/context/AppSettingsContext';
import { MainTabBarSlotProvider } from '../components/MainTabBar/MainTabBarSlot';
import Storage from '../utils/Storage';
import { useAuthSession } from '../hooks/context/AuthContext';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as React from 'react';

BrewskeyJSApi.initialize('https://brewskey.com');

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

// Hydrate auth state from Storage on app startup
const hydrateAuthState = async () => {
  try {
    const authState = await loadAuthStateFromStorage();
    if (authState) {
      setAuthSession(queryClient, authState);
    }
  } catch (error) {
    // Ignore hydration errors
  }
};

// Hydrate app settings from Storage on app startup (after auth is hydrated)
const hydrateAppSettings = async () => {
  try {
    const appSettings = await loadAppSettingsFromStorage();
    // Always set query data, using default values if no stored settings found
    queryClient.setQueryData(APP_SETTINGS_QUERY_KEY, appSettings || {
      manageTapsEnabled: false,
      selectedOrganization: null,
    });
  } catch (error) {
    // Ignore hydration errors, set default values
    queryClient.setQueryData(APP_SETTINGS_QUERY_KEY, {
      manageTapsEnabled: false,
      selectedOrganization: null,
    });
  }
};

function RootLayoutNav() {
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
}

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
    BrewskeyJSApi.setOnSessionUpdated((session, error) => {
      if (error) {
        console.error(error);
      }
      setAuthSession(queryClient, session ?? null);
    });
  }, [queryClient]);

  if (!isHydrated) {
    // Return null or a loading screen while hydrating
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
