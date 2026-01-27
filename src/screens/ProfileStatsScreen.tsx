import * as React from 'react';

import { Text, View } from 'react-native';

import { withErrorBoundary } from '../common/ErrorBoundary';
import { ErrorScreen } from '../common/ErrorScreen';

export const ProfileStatsScreen = withErrorBoundary(
  () => (
    <View>
      <Text>Profile stats and charts </Text>
    </View>
  ),
  <ErrorScreen shouldShowBackButton />,
);
