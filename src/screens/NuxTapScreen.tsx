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
  onContinuePress?: () => undefined | Promise<any>;
}>;

const NuxTapScreen: React.FC<Props> = ({
  route: {
    params: { onContinuePress },
  },
}: Props) => {

  return (
    <Container>
      <Header title="4. Create a tap" />
      <View style={styles.container}>
        <Text style={styles.descriptionText}>
          Almost done. You'll need to set up at least on tap on your Brewskey
          box.
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

export default withErrorBoundary(NuxTapScreen, <ErrorScreen shouldShowBackButton />);
