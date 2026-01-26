import * as React from 'react';

import { Text, View } from 'react-native';

import { withErrorBoundary } from '../common/ErrorBoundary';
import ErrorScreen from '../common/ErrorScreen';

const ProfileStatsScreen: React.FC = () => (
  <View>
    <Text>Profile stats and charts </Text>
  </View>
);

export default withErrorBoundary(
  ProfileStatsScreen,
  <ErrorScreen shouldShowBackButton />,
);
