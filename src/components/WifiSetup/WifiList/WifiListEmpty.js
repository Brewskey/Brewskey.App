// @flow

import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import Container from '../../../common/Container';
import { COLORS, TYPOGRAPHY } from '../../../theme';

const styles = StyleSheet.create({
  text: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
});

const WifiListEmpty = () => (
  <Container centered>
    <Text style={styles.text}>
      We can't detect any nearby WiFi hotspots with your Brewskey box. Please
      move your Brewskey box and pull to refresh the app.
    </Text>
  </Container>
);

export default WifiListEmpty;
