import * as React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { COLORS } from '../theme';

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

type Props = {
  centered?: boolean,
  children?: React.ReactNode,
  style?: StyleProp<ViewStyle>,
  testID?: string,
};

const Container = (
  {
    centered,
    children,
    style,
    testID,
  }: Props,
): React.ReactElement => <View testID={testID} style={[styles.container, centered && styles.centered, style]}>
  {children}
</View>;

export default Container;
