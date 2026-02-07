import { Stack } from 'expo-router';
import type { ErrorBoundaryProps } from 'expo-router';

import { RouteErrorFallback } from 'common/RouteErrorFallback';

/**
 * Expo Router ErrorBoundary: receives error and retry from the router.
 * Integrates with QueryErrorResetBoundary (at root) for "Try again" and
 * shows error details in development.
 */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <RouteErrorFallback error={error} retry={retry} shouldShowBackButton />
  );
}

export default function NuxLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="location" />
      <Stack.Screen name="wifi" />
      <Stack.Screen name="device" />
      <Stack.Screen name="tap" />
      <Stack.Screen name="finish" />
    </Stack>
  );
}
