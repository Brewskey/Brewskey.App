import * as React from 'react';

import { Platform, StyleSheet, View } from 'react-native';

import { COLORS } from '../../theme';
import { getStatusBarHeight } from '../../utils';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary2,
    height: getStatusBarHeight({ skipAndroid: true }),
    width: '100%',
  },
});

const StatusBarFake = (): React.ReactElement | null =>
  Platform.OS === 'ios' ? <View style={styles.container} /> : null;

export { StatusBarFake };
