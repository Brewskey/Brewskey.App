import * as React from 'react';

import { StyleSheet, Text } from 'react-native';

import { Container } from 'common/Container';
import { COLORS, TYPOGRAPHY } from 'theme';

const styles = StyleSheet.create({
  text: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textFaded,
    paddingHorizontal: 50,
    textAlign: 'center',
  },
});

// todo add funny icon
const NearbyLocationsListEmpty = (): React.ReactElement => (
  <Container centered>
    <Text style={styles.text}>
      There are not any Brewskey locations near you!
    </Text>
  </Container>
);

export { NearbyLocationsListEmpty };
