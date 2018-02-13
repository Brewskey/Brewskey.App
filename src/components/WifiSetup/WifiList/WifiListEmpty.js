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
      There are not WiFi networks around the Brewskey box. Move your Brewskey
      box closer to Wifi spot and pull to refresh.
    </Text>
  </Container>
);

export default WifiListEmpty;
