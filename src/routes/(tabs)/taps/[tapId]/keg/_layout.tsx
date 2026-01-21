import * as React from 'react';
import { Stack } from 'expo-router';

import { withErrorBoundary } from '../../../../../common/ErrorBoundary';
import ErrorScreen from '../../../../../common/ErrorScreen';

const KegLayout: React.FC = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="new" />
    </Stack>
  );
};

export default withErrorBoundary(KegLayout, <ErrorScreen shouldShowBackButton />);
