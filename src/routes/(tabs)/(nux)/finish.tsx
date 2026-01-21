import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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

const NuxFinishScreen: React.FC = () => {
  const router = useRouter();
  const { onContinuePress } = useLocalSearchParams<{ onContinuePress?: string }>();

  const handlePress = () => {
    if (onContinuePress) {
      const callback = JSON.parse(onContinuePress);
      callback();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <Container>
      <Header title="Setup completed" />
      <View style={styles.container}>
        <Text style={styles.descriptionText}>
          You've completed setting up Brewskey. Have fun!
        </Text>
        <Button
          onPress={handlePress}
          secondary
          title="Finish"
        />
      </View>
    </Container>
  );
};

export default withErrorBoundary(NuxFinishScreen, <ErrorScreen shouldShowBackButton />);
