import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { TYPOGRAPHY } from '../theme';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  text: {
    ...TYPOGRAPHY.paragraph,
  },
});

interface Props {
  children?: string;
  containerStyle?: StyleProp<ViewStyle>;
  index?: number;
  paddedBottom?: boolean;
  textStyle?: StyleProp<TextStyle>;
}

const OrderedText = ({
  children,
  containerStyle,
  index,
  paddedBottom,
  textStyle,
}: Props): React.ReactElement => (
  <View
    style={[
      styles.container,
      paddedBottom && { paddingBottom: 12 },
      containerStyle,
    ]}
  >
    {index ? (
      <Text style={[styles.text, textStyle]}>{index.toString()}. </Text>
    ) : null}
    <Text style={[styles.text, textStyle]}>{children}</Text>
  </View>
);

export { OrderedText };
