// @flow

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
  },
});

const AppLoading = (): React.Element<*> => (
  <View style={styles.container}>
    <Text style={styles.text}>AppLoading</Text>
  </View>
);

export default AppLoading;
