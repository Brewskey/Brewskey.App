// @flow

import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import Container from './Container';
import Header from './Header';
import Fragment from './Fragment';
import { COLORS, TYPOGRAPHY } from '../theme';

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

type Props = {|
  showBackButton?: boolean,
|};

const ErrorScreen = ({ showBackButton }: Props) => (
  <Fragment>
    <Header showBackButton={showBackButton} title="Whoops! Error!" />
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
