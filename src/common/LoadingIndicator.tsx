import * as React from 'react';

import { ActivityIndicator, StyleSheet, View } from 'react-native';

import type { StyleProp, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

interface Props {
  activitySize?: 'small' | 'large';
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const LoadingContainer = ({
  activitySize = 'large',
  color,
  style,
  testID,
}: Props): React.ReactElement => (
  <View style={style || styles.container} testID={testID}>
    <ActivityIndicator color={color} size={activitySize} />
  </View>
);

export { LoadingContainer as LoadingIndicator };
