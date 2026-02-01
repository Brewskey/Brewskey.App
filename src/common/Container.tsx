import { StyleSheet, View } from 'react-native';

import { COLORS } from 'theme';

import type { ReactElement, ReactNode } from 'react';
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
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const Container = ({
  centered,
  children,
  style,
  testID,
}: Props): ReactElement => (
  <View
    style={[styles.container, centered && styles.centered, style]}
    testID={testID}
  >
    {children}
  </View>
);

export { Container };
