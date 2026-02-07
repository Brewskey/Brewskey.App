import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { StyleSheet, View } from 'react-native';

import { Button } from 'common/buttons/Button';
import { ErrorScreen } from 'common/ErrorScreen';

interface Props {
  shouldShowBackButton?: boolean;
}

/**
 * Error screen that calls QueryErrorResetBoundary reset on "Try again".
 * Must be rendered inside QueryErrorResetBoundary (e.g. as ErrorBoundary fallback).
 */
export const ErrorScreenWithReset = ({
  shouldShowBackButton,
}: Props): React.ReactElement => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <>
      <ErrorScreen shouldShowBackButton={shouldShowBackButton} />
      <View style={styles.actions}>
        <Button
          onPress={() => reset()}
          title="Try again"
          testID="error-screen-try-again"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  actions: {
    paddingHorizontal: 15,
    paddingBottom: 24,
  },
});
