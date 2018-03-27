// @flow

import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../theme';

const styles = StyleSheet.create({
  text: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textFaded,
    paddingHorizontal: 50,
    paddingVertical: 200,
    textAlign: 'center',
  },
});

// todo add funny icon
const NearbyLocationsEmpty = () => (
  <Text style={styles.text}>There are not brewskey locations near you!</Text>
);

export default NearbyLocationsEmpty;
