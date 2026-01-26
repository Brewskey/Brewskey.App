import * as React from 'react';

import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

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

const AppLoading = (): React.ReactElement => (
  <View style={styles.container}>
    <Image
      source={require('../resources/splash.png')}
      style={styles.splashImage}
    />
  </View>
);

export default AppLoading;
