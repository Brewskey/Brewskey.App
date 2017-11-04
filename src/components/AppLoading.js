// @flow

import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import splashImage from '../resources/splash.png';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  splashImage: {
    height: '100%',
    width: '100%',
  },
});

const AppLoading = (): React.Node => (
  <View style={styles.container}>
    <Image source={splashImage} style={styles.splashImage} />
  </View>
);

export default AppLoading;
