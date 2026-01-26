import * as React from 'react';

import { StyleSheet, Text } from 'react-native';

import Container from './Container';
import { COLORS, TYPOGRAPHY } from '../theme';

const styles = StyleSheet.create({
  messageText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    paddingHorizontal: 15,
    paddingVertical: 15,
    textAlign: 'center',
  },
});

interface Props {
  message: string;
}

const ListEmpty = ({ message }: Props): React.ReactElement => (
  <Container centered>
    <Text style={styles.messageText}>{message}</Text>
  </Container>
);

export default ListEmpty;
