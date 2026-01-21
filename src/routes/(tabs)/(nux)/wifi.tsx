import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '@rneui/themed';
import { useLocalSearchParams } from 'expo-router';
import Button from '../../../common/buttons/Button';

import Header from '../../../common/Header';
import ErrorScreen from '../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import Container from '../../../common/Container';
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

const NuxWifiScreen: React.FC = () => {
  const { onContinuePress } = useLocalSearchParams<{ onContinuePress?: string }>();

  const handlePress = () => {
    if (onContinuePress) {
      const callback = JSON.parse(onContinuePress);
      callback();
    }
  };

  return (
    <Container>
      <Header title="2. Setup Wifi" />
      <View style={styles.container} testID="nux-wifi-content">
        <Icon
          color={COLORS.textInverse}
          containerStyle={styles.iconContainer}
          name="wifi"
          size={200}
        />
        <Text style={styles.descriptionText} testID="nux-wifi-description">
          Next, you need to setup WiFi on your Brewskey box.
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

export default withErrorBoundary(NuxWifiScreen, <ErrorScreen shouldShowBackButton />);
