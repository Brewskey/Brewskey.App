import * as React from 'react';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from 'common/buttons/Button';
import { ErrorScreen } from 'common/ErrorScreen';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { ErrorBoundaryProps } from 'expo-router';

export interface RouteErrorFallbackProps extends ErrorBoundaryProps {
  shouldShowBackButton?: boolean;
}

/**
 * Fallback UI for Expo Router's ErrorBoundary export. Receives error and retry
 * from Expo; integrates with QueryErrorResetBoundary so "Try again" resets both
 * route state and React Query errors. In __DEV__, shows error message and stack
 * so development errors are visible.
 */
export const RouteErrorFallback = ({
  error,
  retry,
  shouldShowBackButton = true,
}: RouteErrorFallbackProps): React.ReactElement => {
  const { reset } = useQueryErrorResetBoundary();

  const handleRetry = () => {
    reset();
    void retry();
  };

  if (__DEV__) {
    // Surface to LogBox so devs see the error in the overlay (caught errors
    // don't trigger Redbox by default).
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error.message, error.stack);
  }

  return (
    <React.Fragment>
      <ErrorScreen shouldShowBackButton={shouldShowBackButton} />
      {__DEV__ ? (
        <View style={styles.devSection}>
          <Text style={styles.devTitle}>Development error</Text>
          <ScrollView
            style={styles.devScroll}
            contentContainerStyle={styles.devScrollContent}
          >
            <Text selectable style={styles.devMessage}>
              {error.message}
            </Text>
            {error.stack != null ? (
              <Text selectable style={styles.devStack}>
                {error.stack}
              </Text>
            ) : null}
          </ScrollView>
        </View>
      ) : null}
      <View style={styles.actions}>
        <Button
          onPress={handleRetry}
          title="Try again"
          testID="error-screen-try-again"
        />
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  actions: {
    paddingHorizontal: 15,
    paddingBottom: 24,
  },
  devMessage: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.text,
    marginBottom: 8,
  },
  devScroll: {
    maxHeight: 200,
  },
  devScrollContent: {
    paddingBottom: 16,
  },
  devSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.textFaded,
    marginHorizontal: 15,
    paddingTop: 12,
  },
  devStack: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    fontFamily: 'monospace',
    fontSize: 11,
  },
  devTitle: {
    ...TYPOGRAPHY.heading,
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 8,
  },
});
