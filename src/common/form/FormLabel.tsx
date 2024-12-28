import React, { PropsWithChildren } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Text, normalize } from '@rneui/themed';
import { fonts } from '@rneui/base';

const styles = StyleSheet.create({
  container: {},
  label: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
    marginBottom: 1,
    // color: colors.grey3,
    fontSize: normalize(12),
    ...Platform.select({
      ios: {
        fontWeight: 'bold',
      },
      android: {
        fontFamily: fonts.android.bold.fontFamily,
      },
    }),
  },
});

export const FormLabel: React.FC<
  PropsWithChildren<{
    containerStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    fontFamily?: string;
  }>
> = ({ containerStyle, labelStyle, children, fontFamily }) => (
  <View style={[styles.container, containerStyle && containerStyle]}>
    <Text
      style={[
        styles.label,
        labelStyle && labelStyle,
        fontFamily != null && { fontFamily },
      ]}
    >
      {children}
    </Text>
  </View>
);
