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

const NuxTapScreen: React.FC = () => {
  const { onContinuePress } = useLocalSearchParams<{ onContinuePress?: string }>();

  const handlePress = () => {
    if (onContinuePress) {
      const callback = JSON.parse(onContinuePress);
      callback();
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
          onPress={handlePress}
          secondary
          testID="button-next"
          title="Next"
        />
      </View>
    </Container>
  );
};

export default withErrorBoundary(NuxTapScreen, <ErrorScreen shouldShowBackButton />);
