import { Stack } from 'expo-router';

import { RouteErrorFallback } from 'common/RouteErrorFallback';

import type { ErrorBoundaryProps } from 'expo-router';

export const unstable_settings = {
  feed: { initialRouteName: 'index' },
  stats: { initialRouteName: 'index' },
  notifications: { initialRouteName: 'index' },
  menu: { initialRouteName: 'index' },
};

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

export default function SharedSecondaryLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
