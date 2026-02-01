import * as React from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from 'common/buttons/Button';
import { Container } from 'common/Container';
import { withErrorBoundary } from 'common/ErrorBoundary';
import { ErrorScreen } from 'common/ErrorScreen';
import { Header } from 'common/Header';
import { COLORS, TYPOGRAPHY } from 'theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 30,
  },
  descriptionText: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textInverse,
    paddingVertical: 30,
    textAlign: 'center',
  },
  iconContainer: {
    alignSelf: 'center',
  },
});

const NuxTapScreen: React.FC = () => {
  const router = useRouter();
  const { deviceId } = useLocalSearchParams<{
    deviceId?: string;
  }>();

  const handlePress = () => {
    if (deviceId) {
      router.navigate({
        pathname: '/(tabs)/(feed,stats,notifications,menu)/taps/new',
        params: {
          deviceId,
          returnTo: 'nux-finish',
          showBackButton: 'false',
        },
      });
    } else {
      router.navigate({
        pathname: '/(tabs)/(feed,stats,notifications,menu)/devices',
      });
    }
  };

  return (
    <Container>
      <Header title="4. Create a tap" />
      <View style={styles.container} testID="nux-tap-content">
        <Text style={styles.descriptionText} testID="nux-tap-description">
          Almost done. You'll need to set up at least on tap on your Brewskey
          box.
        </Text>
        <Button
          secondary
          onPress={handlePress}
          testID="button-next"
          title="Next"
        />
      </View>
    </Container>
  );
};

export default withErrorBoundary(
  NuxTapScreen,
  <ErrorScreen shouldShowBackButton />,
);
