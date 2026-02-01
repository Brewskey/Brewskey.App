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

const NuxDeviceScreen: React.FC = () => {
  const router = useRouter();
  const { locationId, particleId } = useLocalSearchParams<{
    locationId?: string;
    particleId?: string;
  }>();

  const handlePress = () => {
    router.navigate({
      pathname: '/(tabs)/(feed,stats,notifications,menu)/devices/new',
      params: {
        particleId,
        locationId: locationId ? String(locationId) : undefined,
        returnTo: 'nux-tap',
        showBackButton: 'false',
      },
    });
  };

  return (
    <Container>
      <Header title="3. Name your device" />
      <View style={styles.container} testID="nux-device-content">
        <Text style={styles.descriptionText} testID="nux-device-description">
          Great! Your Brewskey box is now connected to WiFi and have white
          lights. Next, finish setting up your box.
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
  NuxDeviceScreen,
  <ErrorScreen shouldShowBackButton />,
);
