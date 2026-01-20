import { Input, InputProps } from '@rneui/themed';
import { Controller, Validate, useFormContext } from 'react-hook-form';
import { StyleProp, TextStyle } from 'react-native';
import nullthrows from 'nullthrows';

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
      name={nullthrows(name, 'TextInput: name prop is required and must be a non-empty string')}
      defaultValue={defaultValue ?? ''}
      rules={{ required }}
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          {...props}
          inputStyle={[
            inputStyle,
            {
              borderColor: underlineColorAndroid,
            },
          ]}
          onBlur={onBlur}
          onChangeText={onChange}
          testID={testID}
          value={value ?? ''}
          onSubmitEditing={
            nextFocusTo ? () => setFocus(nextFocusTo) : undefined
          }
        />
      )}
    />
  );
};
