// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../theme';

const styles = StyleSheet.create({
  separator: {
    backgroundColor: COLORS.secondary2,
    height: 4,
  },
});

const ListSubSectionSeparator = (): React.Node => (
  <View style={styles.separator} />
);

export default ListSubSectionSeparator;
