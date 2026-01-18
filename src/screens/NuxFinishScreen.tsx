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

const NuxFinishScreen: React.FC<Props> = ({
  route: {
    params: { onContinuePress },
  },
}: Props) => {

  return (
    <Container>
      <Header title="Setup completed" />
      <View style={styles.container}>
        <Text style={styles.descriptionText}>
          You've completed setting up Brewskey. Have fun!
        </Text>
        <Button
          onPress={onContinuePress}
          secondary
          title="Finish"
        />
      </View>
    </Container>
  );
};

export default withErrorBoundary(NuxFinishScreen, <ErrorScreen showBackButton />);
