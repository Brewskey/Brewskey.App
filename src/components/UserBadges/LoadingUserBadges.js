// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import LoadingIndicator from '../../common/LoadingIndicator';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 80,
  },
});

const LoadingUserBadges = () => (
  <View style={styles.container}>
    <LoadingIndicator />
  </View>
);

export default LoadingUserBadges;
