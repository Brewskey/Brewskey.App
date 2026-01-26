import { Input } from '@rneui/themed';
import nullthrows from 'nullthrows';
import { Controller, useFormContext } from 'react-hook-form';

import type { InputProps } from '@rneui/themed';
import type { Validate } from 'react-hook-form';
import type { StyleProp, TextStyle } from 'react-native';

export type TextInputProps = Omit<
  InputProps,
  'onBlur' | 'onChangeText' | 'value'
> & {
  inputStyle?: StyleProp<TextStyle>;
  underlineColorAndroid?: string;
  name: string;
  defaultValue?: string;
  nextFocusTo?: string;
  validationTextStyle?: StyleProp<TextStyle>;
  required?: boolean;
  validate?: Validate<string, Record<string, unknown>>;
  testID?: string;
};

export const TextInput: React.FC<TextInputProps> = ({
  nextFocusTo,
  defaultValue,
  inputStyle,
  underlineColorAndroid,
  required = false,
  name,
  testID,
  ...props
}: TextInputProps) => {
  const { control, setFocus } = useFormContext();

  return (
    <Controller
      control={control}
      defaultValue={defaultValue ?? ''}
      rules={{ required }}
      name={nullthrows(
        name,
        'TextInput: name prop is required and must be a non-empty string',
      )}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          {...props}
          onBlur={onBlur}
          onChangeText={onChange}
          testID={testID}
          value={value ?? ''}
          inputStyle={[
            inputStyle,
            {
              borderColor: underlineColorAndroid,
            },
          ]}
          onSubmitEditing={
            nextFocusTo ? () => setFocus(nextFocusTo) : undefined
          }
        />
      )}
    />
  );
};
