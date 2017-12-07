// @flow

import * as React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

type Props = {|
  color?: string,
  activitySize?: 'small' | 'large',
  style?: Object,
|};

const LoadingContainer = ({ activitySize = 'large', color, style }: Props) => (
  <View style={[styles.container, style]}>
    <ActivityIndicator color={color} size={activitySize} />
  </View>
);

export default LoadingContainer;
