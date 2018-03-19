// @flow

import * as React from 'react';
import { View } from 'react-native';
import {
  FormInput,
  FormLabel,
  FormValidationMessage,
} from 'react-native-elements';
import nullthrows from 'nullthrows';

export type Props = {
  error?: ?string,
  inputRef?: React.Ref<typeof FormInput>,
  label?: string,
  onBlur?: () => void,
  onChange: (value: any) => void,
  value: any,
  // other react-native textInput props
};

class TextField extends React.Component<Props> {
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

  render() {
    const {
      error,
      inputRef,
      label,
      onBlur,
      onChange,
      value,
      ...props
    } = this.props;

    return (
      <View>
        <FormLabel>{label}</FormLabel>
        <FormInput
          onBlur={onBlur}
          onChangeText={onChange}
          ref={this._setRef}
          value={value || value === 0 ? value.toString() : null}
          {...props}
        />
        <FormValidationMessage>{error}</FormValidationMessage>
      </View>
    );
  }
}

export default TextField;
