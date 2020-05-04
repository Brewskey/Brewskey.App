// @flow

import type { Style } from '../types';

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  FormInput,
  FormLabel,
  FormValidationMessage,
} from 'react-native-elements';
import nullthrows from 'nullthrows';
import { COLORS, TYPOGRAPHY } from '../theme';

export type Props<TOtherProps> = {|
  ...TOtherProps,
  description?: string,
  error?: ?string,
  inputRef?: React.Ref<typeof FormInput>,
  inputStyle?: Style,
  label?: string,
  labelStyle?: Style,
  onBlur?: () => void,
  onChange: (value: any) => void,
  underlineColorAndroid?: string,
  validationTextStyle?: Style,
  value: any,
  // other react-native textInput props
|};

class TextField<TOtherProps> extends React.Component<Props<TOtherProps>> {
  static defaultProps = {
    underlineColorAndroid: COLORS.secondary3,
  };

  _inputRef: ?FormInput;

  _setRef = (ref: FormInput) => {
    const { inputRef } = this.props;
    this._inputRef = ref;
    if (inputRef && typeof inputRef === 'function') {
      inputRef(ref);
    }
  };

  focus = () => {
    nullthrows(this._inputRef).focus();
  };

  render(): React.Node {
    const {
      description,
      error,
      inputRef,
      inputStyle,
      label,
      labelStyle,
      onBlur,
      onChange,
      validationTextStyle,
      value,
      ...props
    } = this.props;

    return (
      <View>
        <FormLabel labelStyle={labelStyle}>{label}</FormLabel>
        <FormInput
          inputStyle={inputStyle}
          onBlur={onBlur}
          onChangeText={onChange}
          ref={this._setRef}
          value={value || value === 0 ? value.toString() : null}
          {...props}
        />
        {description == null ? null : (
          <Text style={styles.description}>{description}</Text>
        )}
        <FormValidationMessage labelStyle={validationTextStyle}>
          {error}
        </FormValidationMessage>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  description: {
    ...TYPOGRAPHY.small,
    color: COLORS.textFaded,
    marginHorizontal: 20,
  },
});

export default TextField;
