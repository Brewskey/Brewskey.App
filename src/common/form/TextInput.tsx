import { Input } from '@rneui/themed';
import nullthrows from 'nullthrows';
import { Controller, useFormContext } from 'react-hook-form';

import type { InputProps } from '@rneui/themed';
import type { FieldValues, Validate } from 'react-hook-form';
import type { StyleProp, TextStyle } from 'react-native';

/**
 * Native text fields require string values; react-hook-form may store numbers.
 * Coerces any field value into a safe display string.
 */
export function stringifyFormFieldInput(value: unknown): string {
  if (value == null || value === '') {
    return '';
  }
  if (typeof value === 'number' && Number.isNaN(value)) {
    return '';
  }
  return String(value);
}

export type TextInputProps<TFormFields extends FieldValues> = Omit<
  InputProps,
  'onBlur' | 'onChangeText' | 'value' | 'name' | 'ref'
> & {
  inputStyle?: StyleProp<TextStyle>;
  underlineColorAndroid?: string;
  name: Extract<keyof TFormFields, string>;
  /** May be string or number; always coerced for the underlying TextInput. */
  defaultValue?: string | number;
  nextFocusTo?: string;
  validationTextStyle?: StyleProp<TextStyle>;
  required?: boolean;
  validate?: Validate<string, Record<string, unknown>>;
  testID?: string;
};

export const TextInput = <TFormFields extends FieldValues>({
  nextFocusTo,
  defaultValue,
  inputStyle,
  underlineColorAndroid,
  required = false,
  name,
  testID,
  ...props
}: TextInputProps<TFormFields>) => {
  const { control, setFocus } = useFormContext();

  const controllerInitial =
    defaultValue === undefined
      ? undefined
      : stringifyFormFieldInput(defaultValue);

  return (
    <Controller
      control={control}
      {...(controllerInitial !== undefined
        ? { defaultValue: controllerInitial }
        : {})}
      rules={{ required }}
      name={nullthrows(
        name.toString(),
        'TextInput: name prop is required and must be a non-empty string',
      )}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          {...props}
          onBlur={onBlur}
          onChangeText={onChange}
          testID={testID}
          value={stringifyFormFieldInput(value)}
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
