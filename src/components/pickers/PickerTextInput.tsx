import type { StyleProp, TextStyle } from 'react-native';
import type { PickerValue } from './LocationPicker';

import * as React from 'react';
import { StyleSheet, Text } from 'react-native';

import PickerInput from './PickerInput';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  valueText: {
    color: COLORS.textInput,
    fontSize: 17,
  },
});

export type Props<TValue> = {
  description?: React.ReactNode;
  disabled?: boolean;
  error?: string | null | undefined;
  inputStyle?: StyleProp<TextStyle>;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  onPress: () => void;
  placeholder?: string;
  stringValueExtractor: (item: TValue) => string;
  testID?: string;
  value: TValue | null | undefined | TValue[];
  // other react-native textInput props
};

const PickerTextInput = <TValue,>({
  description,
  disabled,
  error,
  inputStyle,
  label,
  labelStyle,
  onPress,
  placeholder = 'Please select...',
  stringValueExtractor,
  testID,
  value,
}: Props<TValue>): React.ReactElement => {
  const stringValue = React.useMemo(() => {
    if (Array.isArray(value)) {
      return value.map(stringValueExtractor).join(', ');
    }
    return value ? stringValueExtractor(value) : '';
  }, [value, stringValueExtractor]);

  return (
    <PickerInput
      description={description}
      disabled={disabled}
      error={error}
      label={label}
      labelStyle={labelStyle}
      onPress={onPress}
      placeholder={placeholder}
      testID={testID}
      value={value}
    >
      <Text style={[styles.valueText, inputStyle]}>{stringValue}</Text>
    </PickerInput>
  );
};

export default PickerTextInput;
