import { StyleSheet, Text } from 'react-native';

import { Container } from './Container';
import { COLORS, TYPOGRAPHY } from '../theme';

import type { FC } from 'react';

const styles = StyleSheet.create({
  text: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    textAlign: 'center',
  },
});

const NotImplementedPlaceholder: FC = () => (
  <Container centered>
    <Text style={styles.text}>Coming soon...</Text>
  </Container>
);

export { NotImplementedPlaceholder };
