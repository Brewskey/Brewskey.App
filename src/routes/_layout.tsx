import * as React from 'react';

import BrewskeyJSApi from '@brewskey/js-api';
import {
  QueryClientProvider,
  QueryErrorResetBoundary,
} from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  initialWindowMetrics,
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

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

// iOS reports a generous safe area top inset (~59pt on Dynamic Island
// devices, ~47pt on notched devices) which leaves visible breathing room
// between the camera cutout and the heading. Subtract that breathing room
// so the heading sits snug to the bottom of the camera cutout.
const IOS_TOP_INSET_TRIM = 11;

const RootSafeArea: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const insets = useSafeAreaInsets();
  const paddingTop =
    Platform.OS === 'ios'
      ? Math.max(insets.top - IOS_TOP_INSET_TRIM, 20)
      : insets.top;
  // On Android the system navigation bar (gesture/3-button) remains visible
  // at the bottom of the screen. Reserve space for it so the custom tab bar
  // sits above it instead of being covered. iOS keeps its existing behavior
  // (the tab bar extends into the home-indicator area).
  const paddingBottom = Platform.OS === 'android' ? insets.bottom : 0;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.primary2,
        paddingTop,
        paddingBottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {children}
    </View>
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <RootSafeArea>
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
        </RootSafeArea>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
