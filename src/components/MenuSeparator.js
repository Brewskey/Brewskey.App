// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../theme';

const styles = StyleSheet.create({
  separator: {
    backgroundColor: COLORS.secondary2,
    height: 1,
    width: '100%',
  },
});

const DrawerSeparator = (): React.Node => <View style={styles.separator} />;

export default DrawerSeparator;
