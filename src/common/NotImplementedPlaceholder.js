// @flow

import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import Container from '../common/Container';
import { COLORS, TYPOGRAPHY } from '../theme';

const styles = StyleSheet.create({
  text: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    textAlign: 'center',
  },
});

class NotImplementedPlaceholder extends React.PureComponent<{}> {
  render() {
    return (
      <Container centered>
        <Text style={styles.text}>Coming soon...</Text>
      </Container>
    );
  }
}

export default NotImplementedPlaceholder;
