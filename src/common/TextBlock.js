// @flow

import type { Style } from '../types';

import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TYPOGRAPHY } from '../theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  text: {
    ...TYPOGRAPHY.paragraph,
  },
});

type Props = {|
  children?: string,
  containerStyle?: Style,
  index?: number,
  paddedBottom?: boolean,
  textStyle?: Style,
|};

const OrderedText = ({
  children,
  containerStyle,
  index,
  paddedBottom,
  textStyle,
}: Props) => (
  <View
    style={[
      styles.container,
      paddedBottom && { paddingBottom: 12 },
      containerStyle,
    ]}
  >
    {index && (
      <Text style={[styles.text, textStyle]}>{index.toString()}. </Text>
    )}
    <Text style={[styles.text, textStyle]}>{children}</Text>
  </View>
);

export default OrderedText;
