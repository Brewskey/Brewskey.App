// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';

// todo make better styles, may be add borders etc
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.secondary3,
    paddingVertical: 12,
  },
  title: {
    ...TYPOGRAPHY.secondary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

type Props = {|
  title: string,
|};

const SectionHeader = ({ title }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default SectionHeader;
