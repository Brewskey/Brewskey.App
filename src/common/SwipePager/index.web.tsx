import * as React from 'react';

import { View } from 'react-native';

import type { StyleProp, ViewStyle } from 'react-native';

export interface SwipePagerProps {
  currentIndex: number;
  onIndexChanged: (index: number) => void;
  children: React.ReactElement[];
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

// Web fallback: renders only the active child. `react-native-pager-view` is
// native-only (it imports react-native internals), so this stub keeps it out
// of the Metro web bundle entirely.
export const SwipePager: React.FC<SwipePagerProps> = ({
  currentIndex,
  children,
  style,
  testID,
}) => (
  <View style={style} testID={testID}>
    {children[currentIndex] ?? null}
  </View>
);
