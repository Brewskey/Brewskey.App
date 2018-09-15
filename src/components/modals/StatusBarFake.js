// @flow

import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from '../../utils';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary2,
    height: getStatusBarHeight({ skipAndroid: true }),
    width: '100%',
  },
});

const StatusBarFake = () =>
  Platform.OS === 'ios' ? <View style={styles.container} /> : null;

export default StatusBarFake;
