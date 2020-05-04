// @flow

import type { Style } from '../types';

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
  activitySize?: 'small' | 'large',
  color?: string,
  style?: Style,
|};

const LoadingContainer = ({
  activitySize = 'large',
  color,
  style,
}: Props): React.Node => (
  <View style={style || styles.container}>
    <ActivityIndicator color={color} size={activitySize} />
  </View>
);

export default LoadingContainer;
