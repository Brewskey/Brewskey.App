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
  onBlur: () => void,
  onChange: (value: any) => void,
  value: any,
  // other react-native textInput props
};

const TextField = ({
  error,
  inputRef,
  label,
  onBlur,
  onChange,
  value,
  ...props
}: Props) => (
  <View>
    <FormLabel>{label}</FormLabel>
    <FormInput
      ref={inputRef}
      onBlur={onBlur}
      onChangeText={onChange}
      value={value && value.toString()}
      {...props}
    />
    <FormValidationMessage>{error}</FormValidationMessage>
  </View>
);

export default TextField;
