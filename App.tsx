import './src/polyfills';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './src/AppRouter';
import BrewskeyJSApi from '@brewskey/js-api';
import { AUTH_QUERY_KEY, loadAuthStateFromStorage } from './src/hooks/context/AuthContext';
import { APP_SETTINGS_QUERY_KEY, loadAppSettingsFromStorage } from './src/hooks/context/AppSettingsContext';
import { SnackBar } from './src/common/SnackBar';
import { SnackBarProvider } from './src/hooks/context/SnackBarContext';
import { PourProcessProvider } from './src/hooks/context/PourProcessContext';
import { AppSettingsProvider } from './src/hooks/context/AppSettingsContext';
import { MainTabBarSlotProvider } from './src/components/MainTabBar/MainTabBarSlot';
import Storage from './src/utils/Storage';
import * as React from 'react';

BrewskeyJSApi.initialize('https://brewskey.com');

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
});

// Hydrate auth state from Storage on app startup
const hydrateAuthState = async () => {
  try {
    const authState = await loadAuthStateFromStorage();
    if (authState) {
      queryClient.setQueryData(AUTH_QUERY_KEY, authState);
      
      // Setup Storage.getUserID callback for app settings hydration
      const userID = authState.id
        ? authState.id === ''
          ? null
          : authState.id.toString()
        : null;
      Storage.setGetUserID(async () => {
        return userID || '';
      });
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

export default function App() {
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
              <AppRouter />
              <SnackBar />
            </MainTabBarSlotProvider>
          </PourProcessProvider>
        </SnackBarProvider>
      </AppSettingsProvider>
    </QueryClientProvider>
  );
}
