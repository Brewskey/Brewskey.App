import * as React from 'react';
import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import { Text, View } from 'react-native';

const ProfileStatsScreen: React.FC = () => {
  return (
    <View>
      <Text>Profile stats and charts </Text>
    </View>
  );
};

export default withErrorBoundary(ProfileStatsScreen, <ErrorScreen showBackButton />);
