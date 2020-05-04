// @flow

import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';
import Container from '../common/Container';

const styles = StyleSheet.create({
  messageText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    paddingHorizontal: 15,
    paddingVertical: 15,
    textAlign: 'center',
  },
});

type Props = {|
  message: string,
|};

const ListEmpty = ({ message }: Props): React.Node => (
  <Container centered>
    <Text style={styles.messageText}>{message}</Text>
  </Container>
);

export default ListEmpty;
