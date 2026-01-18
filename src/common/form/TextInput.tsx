import { Input, InputProps } from '@rneui/themed';
import { Controller, Validate, useFormContext } from 'react-hook-form';
import { StyleProp, TextStyle } from 'react-native';

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
};

export const TextInput: React.FC<TextInputProps> = ({
  nextFocusTo,
  defaultValue,
  inputStyle,
  underlineColorAndroid,
  required = false,
  ...props
}: TextInputProps) => {
  const { control, setFocus } = useFormContext();

  return (
    <Controller
      control={control}
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
          value={value ?? ''}
          onSubmitEditing={
            nextFocusTo ? () => setFocus(nextFocusTo) : undefined
          }
        />
      )}
      name={props.name}
    />
  );
};
