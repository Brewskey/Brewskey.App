import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StaticScreenProps } from '@react-navigation/native';

import Button from '../common/buttons/Button';
import Header from '../common/Header';
import Container from '../common/Container';
import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import { COLORS, TYPOGRAPHY } from '../theme';

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

type Props = StaticScreenProps<{
  onContinuePress?: () => undefined | Promise<undefined>;
}>;

const NuxDeviceScreen: React.FC<Props> = ({
  route: {
    params: { onContinuePress },
  },
}: Props) => {

  return (
    <Container>
      <Header title="3. Name your device" />
      <View style={styles.container}>
        <Text style={styles.descriptionText}>
          Great! Your Brewskey box is now connected to WiFi and have white
          lights. Next, finish setting up your box.
        </Text>
        <Button
          onPress={onContinuePress}
          secondary
          title="Next"
        />
      </View>
    </Container>
  );
};

export default withErrorBoundary(NuxDeviceScreen, <ErrorScreen shouldShowBackButton />);
