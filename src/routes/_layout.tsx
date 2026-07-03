import * as React from 'react';

import BrewskeyJSApi from '@brewskey/js-api';
import {
  QueryClientProvider,
  QueryErrorResetBoundary,
} from '@tanstack/react-query';
import { router, Stack } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
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
import { CONFIG } from '../config';
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
import {
  getDeviceIdFromTag,
  PourProcessProvider,
} from '../hooks/context/PourProcessContext';
import { SnackBarProvider } from '../hooks/context/SnackBarContext';
import { useEASUpdateAutoReload } from '../hooks/useEASUpdateAutoReload';
import { getNfcManager } from '../services/nfc';
import { queryClient } from '../utils/queryClient';

BrewskeyJSApi.initialize(CONFIG.HOST);

// Required at module scope so the popup window opened by `expo-auth-session`
// (used by `googleSignIn.ts` for the web Google login flow) can detect the
// OAuth redirect and `postMessage` the result back to the opener. No-op on
// native, where the in-app browser handles redirects via deep linking.
WebBrowser.maybeCompleteAuthSession();

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
  const needsUsername = authResponse?.isNewAccount === true;

  // Android: when the app is cold-started by tapping the box's NFC tag (the
  // Android Application Record dispatches NDEF_DISCOVERED, not a URL), pull
  // the launch tag and route to the same /d/<id> screen App Links use.
  React.useEffect(() => {
    if (Platform.OS !== 'android' || !authResponse) {
      return;
    }
    const nfc = getNfcManager();
    const NfcManager = nfc?.default ?? null;
    NfcManager?.getLaunchTagEvent?.()
      .then((tag: unknown) => {
        if (tag == null) {
          return;
        }
        try {
          const deviceId = getDeviceIdFromTag(
            tag as Parameters<typeof getDeviceIdFromTag>[0],
          );
          if (deviceId != null) {
            router.replace({
              pathname: '/d/[deviceId]',
              params: { deviceId: String(deviceId) },
            });
          }
        } catch {
          // Not a Brewskey tag; ignore.
        }
      })
      .catch(() => {});
  }, [authResponse]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!authResponse && !needsUsername}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="d/[deviceId]" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!!authResponse && needsUsername}>
        <Stack.Screen name="set-username" options={{ headerShown: false }} />
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
  useEASUpdateAutoReload();

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
        // eslint-disable-next-line no-console
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
