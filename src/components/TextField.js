// @flow

import * as React from 'react';
import { View } from 'react-native';
import {
  FormInput,
  FormLabel,
  FormValidationMessage,
} from 'react-native-elements';

export type Props = {
  error?: ?string,
  inputRef?: React.Ref<typeof FormInput>,
  label?: string,
  onBlur?: () => void,
  onChange: (value: any) => void,
  value: any,
  // other react-native textInput props
};

class TextField extends React.Component {
  _inputRef;

  _setRef = ref => {
    const { inputRef } = this.props;
    this._inputRef = ref;
    if (inputRef) {
      inputRef(ref);
    }
  };

  focus = () => {
    this._inputRef.focus();
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
          ref={this._setRef}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value && value.toString()}
          {...props}
        />
        <FormValidationMessage>{error}</FormValidationMessage>
      </View>
    );
  }
}

export default TextField;
