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
import FormLabel from '../../common/form/FormLabel';
import FormValidationMessage from '../../common/form/FormValidationMessage';
import { COLORS, TYPOGRAPHY } from '../../theme';

const styles = StyleSheet.create({
  descriptionContainer: {
    marginHorizontal: 20,
    marginTop: 8,
  },
  descriptionText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textFaded,
  },
  labelStyle: {
    marginHorizontal: 20,
  },
  placeholderText: {
    color: COLORS.textInputPlaceholder,
    fontSize: 17,
  },
  underline: {
    backgroundColor: COLORS.secondary3,
    height: 1,
    marginHorizontal: 10,
  },
  valueContainer: {
    color: COLORS.textFaded,
    justifyContent: 'center',
    marginHorizontal: 16,
    minHeight: Platform.OS === 'ios' ? 36 : 46,
  },
});

export type Props = {
  children?: React.Node,
  description?: React.Node,
  error?: ?string,
  label?: string,
  labelStyle: Style,
  onPress: () => void,
  placeholder?: ?string,
  value: any,
};

class PickerInput extends React.Component<Props> {
  render(): React.Node {
    const {
      children,
      description,
      error,
      label,
      labelStyle,
      onPress,
      placeholder,
      value,
    } = this.props;

    let renderedDescription = null;
    if (description != null) {
      renderedDescription = (
        <View style={styles.descriptionContainer}>
          {typeof description === 'string' ? (
            <Text style={styles.descriptionText}>{description}</Text>
          ) : (
            description
          )}
        </View>
      );
    }

    return (
      <View
        style={{
          marginHorizontal: 16,
        }}
      >
        <TouchableOpacity onPress={onPress}>
          <FormLabel labelStyle={labelStyle}>{label}</FormLabel>
          <View style={styles.valueContainer}>
            {!value || (Array.isArray(value) && !value.length) ? (
              <Text style={styles.placeholderText}>{placeholder}</Text>
            ) : (
              children
            )}
          </View>
          <View style={styles.underline} />
          {renderedDescription}
          <FormValidationMessage>{error}</FormValidationMessage>
        </TouchableOpacity>
      </View>
    );
  }
}

export default PickerInput;
