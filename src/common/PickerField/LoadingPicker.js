// @flow

import * as React from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../theme';

const styles = StyleSheet.create({
  activityInidicator: {
    marginLeft: 'auto',
    marginRight: 3,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    marginHorizontal: 19,
  },
  loadingText: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.text,
  },
});

const LoadingPicker = () => (
  <View style={styles.container}>
    <Text style={styles.loadingText}>Loading...</Text>
    <ActivityIndicator style={styles.activityInidicator} />
  </View>
);

export default LoadingPicker;
