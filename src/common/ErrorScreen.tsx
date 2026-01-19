import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import Container from './Container';
import Header from './Header';
import Fragment from './Fragment';
import { COLORS, TYPOGRAPHY } from '../theme';
import { Icon } from '@rneui/themed';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  text: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    textAlign: 'center',
  },
});

type Props = {
  shouldShowBackButton?: boolean;
};

const ErrorScreen = ({ shouldShowBackButton }: Props): React.ReactElement => (
  <Fragment>
    <Header shouldShowBackButton={shouldShowBackButton} title="Whoops! Error!" />
    <Container centered style={styles.container}>
      <Icon
        reverse
        reverseColor={COLORS.accent}
        color={COLORS.secondary2}
        name="priority-high"
        size={45}
      />
      <Text style={styles.text}>
        Whoa! Brewskey had an error. We'll try to get it fixed soon.
      </Text>
    </Container>
  </Fragment>
);

export default ErrorScreen;
