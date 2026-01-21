import type { Srm } from '@brewskey/js-api';
import type { StyleProp, TextStyle } from 'react-native';
import type { PickerValue } from './LocationPicker';
import type { Props as PickerTextInputProps } from './PickerTextInput';

import * as React from 'react';

import PickerInput from './PickerInput';
import PickerSrmInputValue from './PickerSrmInputValue';

type Props = PickerTextInputProps<Srm>;

const PickerSrmInput: React.FC<Props> = ({
  error,
  label,
  labelStyle,
  onPress,
  placeholder = 'Please select...',
  value,
}) => {
  return (
    <PickerInput
      labelStyle={labelStyle}
      error={error}
      label={label}
      onPress={onPress}
      placeholder={placeholder}
      value={value}
    >
      {value && !Array.isArray(value) ? (
        <PickerSrmInputValue srm={value} />
      ) : null}
    </PickerInput>
  );
};

export default PickerSrmInput;
