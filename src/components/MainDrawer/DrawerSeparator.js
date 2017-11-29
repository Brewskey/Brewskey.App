// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  seperator: {
    backgroundColor: COLORS.secondary2,
    height: 1,
    marginVertical: 10,
    width: '100%',
  },
});

const DrawerSeparator = () => <View style={styles.seperator} />;

export default DrawerSeparator;
