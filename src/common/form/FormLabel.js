import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import colors from 'react-native-elements/src/config/colors';
import fonts from 'react-native-elements/src/config/fonts';
import Text from 'react-native-elements/src/text/Text';
import normalize from 'react-native-elements/src/helpers/normalizeText';

const styles = StyleSheet.create({
  container: {},
  label: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    marginBottom: 1,
    color: colors.grey3,
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

const FormLabel = ({ containerStyle, labelStyle, children, fontFamily }) => (
  <View style={[styles.container, containerStyle && containerStyle]}>
    <Text
      style={[
        styles.label,
        labelStyle && labelStyle,
        fontFamily && { fontFamily },
      ]}
    >
      {children}
    </Text>
  </View>
);

export default FormLabel;
