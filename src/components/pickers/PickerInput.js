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
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  placeholderText: {
    color: COLORS.textInputPlaceholder,
    fontSize: 17,
  },
  underline: {
    backgroundColor: COLORS.secondary3,
    height: 1,
    marginHorizontal: 20,
  },
  valueContainer: {
    justifyContent: 'center',
    marginHorizontal: 20,
    minHeight: Platform.OS === 'ios' ? 36 : 46,
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
