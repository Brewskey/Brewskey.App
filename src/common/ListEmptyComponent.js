// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  messageText: {
    ...TYPOGRAPHY.secondary,
    color: COLORS.textFaded,
    textAlign: 'center',
  },
});

type Props = {|
  message: string,
|};

const ListEmptyComponent = ({ message }: Props) => (
  <View style={styles.container}>
    <Text style={styles.messageText}>{message}</Text>
  </View>
);

export default ListEmptyComponent;
