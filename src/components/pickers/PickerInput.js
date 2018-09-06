// @flow

import type { Style } from '../../types';

import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FormLabel, FormValidationMessage } from 'react-native-elements';
import { COLORS, TYPOGRAPHY } from '../../theme';

const styles = StyleSheet.create({
  placeholderText: {
    ...TYPOGRAPHY.paragraph,
    color: COLORS.textInputPlaceholder,
  },
  underline: {
    backgroundColor: COLORS.secondary3,
    height: 1,
    marginHorizontal: Platform.OS === 'ios' ? 20 : 15,
  },
  valueContainer: {
    justifyContent: 'center',
    ...Platform.select({
      android: {
        marginHorizontal: 15,
        minHeight: 46,
      },
      ios: {
        marginHorizontal: 20,
        minHeight: 36,
      },
    }),
  },
});

export type Props = {
  children?: React.Node,
  error?: ?string,
  label?: string,
  labelStyle: Style,
  onPress: () => void,
  placeholder?: ?string,
  value: any,
};

class PickerInput extends React.Component<Props> {
  render() {
    const { children, error, label, onPress, placeholder, value } = this.props;

    return (
      <TouchableOpacity onPress={onPress}>
        <FormLabel>{label}</FormLabel>
        <View style={styles.valueContainer}>
          {!value || (Array.isArray(value) && !value.length) ? (
            <Text style={styles.placeholderText}>{placeholder}</Text>
          ) : (
            children
          )}
        </View>
        <View style={styles.underline} />
        <FormValidationMessage>{error}</FormValidationMessage>
      </TouchableOpacity>
    );
  }
}

export default PickerInput;
