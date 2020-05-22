// @flow

import type { Style } from '../types';

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Input } from 'react-native-elements';
import FormLabel from '../common/form/FormLabel';
import FormValidationMessage from '../common/form/FormValidationMessage';
import nullthrows from 'nullthrows';
import { COLORS, TYPOGRAPHY } from '../theme';

export type Props = {|
  ...React.ElementProps<typeof Input>,
  description?: string,
  error?: ?string,
  inputRef?: React.Ref<typeof Input>,
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

class TextField extends React.Component<Props> {
  static defaultProps = {
    underlineColorAndroid: COLORS.secondary3,
  };

  _inputRef: ?Input;

  _setRef = (ref: ?Input) => {
    const { inputRef } = this.props;
    this._inputRef = ref;
    if (ref != null && inputRef && typeof inputRef === 'function') {
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
      underlineColorAndroid,
      validationTextStyle,
      value,
      ...props
    } = this.props;

    return (
      <View>
        <FormLabel labelStyle={labelStyle}>{label}</FormLabel>
        <Input
          inputStyle={{
            ...inputStyle,
            borderColor: underlineColorAndroid,
          }}
          onBlur={onBlur}
          onChangeText={onChange}
          ref={this._setRef}
          value={value || value === 0 ? value.toString() : ''}
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
