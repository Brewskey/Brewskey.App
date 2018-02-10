// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
});

const WifiListError = () => (
  <View style={styles.container}>
    <Text>Couldn&#8217;t receive the brewskey box available WiFi networks</Text>
    <Text>
      Try unplugging and plugging the Brewskey box back in. Reconnect to
      Photon-XXX WiFi network. And pull to refresh.
    </Text>
  </View>
);

export default WifiListError;
