// @flow

import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';

// todo make better styles, may be add borders etc
const styles = StyleSheet.create({
  title: {
    ...TYPOGRAPHY.secondary,
    backgroundColor: COLORS.secondary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.secondary3,
    fontWeight: 'bold',
    paddingVertical: 12,
    textAlign: 'center',
  },
});

type Props = {|
  title: string,
|};

const SectionHeader = ({ title }: Props) => (
  <Text style={styles.title}>{title}</Text>
);

export default SectionHeader;
