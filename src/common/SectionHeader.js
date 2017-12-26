// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TYPOGRAPHY } from '../theme';

// todo make better styles, may be add borders etc
const styles = StyleSheet.create({
  titleText: { ...TYPOGRAPHY.secondary, textAlign: 'center' },
});

type Props = {|
  title: string,
|};

const SectionHeader = ({ title }: Props) => (
  <View>
    <Text style={styles.titleText}>{title}</Text>
  </View>
);

export default SectionHeader;
