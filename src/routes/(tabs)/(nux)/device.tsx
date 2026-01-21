import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import Button from '../../../common/buttons/Button';
import Header from '../../../common/Header';
import Container from '../../../common/Container';
import ErrorScreen from '../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import { COLORS, TYPOGRAPHY } from '../../../theme';

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
  const { onContinuePress } = useLocalSearchParams<{ onContinuePress?: string }>();

  const handlePress = () => {
    if (onContinuePress) {
      const callback = JSON.parse(onContinuePress);
      callback();
    }
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
          onPress={handlePress}
          secondary
          testID="button-next"
          title="Next"
        />
      </View>
    </Container>
  );
};

export default withErrorBoundary(NuxDeviceScreen, <ErrorScreen shouldShowBackButton />);
