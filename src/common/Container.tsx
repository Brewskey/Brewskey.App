import * as React from 'react';

import { StyleSheet, View } from 'react-native';

import { COLORS } from '../theme';

import type { StyleProp, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: COLORS.secondary,
    flex: 1,
  },
});

interface Props {
  centered?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const Container = ({
  centered,
  children,
  style,
  testID,
}: Props): React.ReactElement => (
  <View
    style={[styles.container, centered && styles.centered, style]}
    testID={testID}
  >
    {children}
  </View>
);

export default Container;
