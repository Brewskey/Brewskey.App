import { CheckBox } from '@rneui/themed';
import nullthrows from 'nullthrows';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';

import { COLORS } from 'theme';

import type { CheckBoxProps } from '@rneui/themed';

export type CheckBoxInputProps<TFormFields extends FieldValues> = Omit<
  CheckBoxProps,
  'checked' | 'children' | 'onBlur' | 'title' | 'name'
> & {
  label: string;
  name: Extract<keyof TFormFields, string>;
  defaultValue?: boolean;
  // validationTextStyle?: StyleProp<TextStyle>;
  required?: boolean;
  testID?: string;
};

export const CheckBoxInput = <TFormFields extends FieldValues>({
  defaultValue,
  required = false,
  name,
  label,
  testID,
  ...props
}: CheckBoxInputProps<TFormFields>) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      defaultValue={defaultValue ?? false}
      rules={{ required }}
      name={nullthrows(
        name.toString(),
        'CheckBoxInput: name prop is required and must be a non-empty string',
      )}
      render={({ field: { onChange, onBlur, value } }) => (
        <CheckBox
          {...props}
          checked={value}
          checkedColor={COLORS.primary}
          containerStyle={{ marginLeft: 24, marginRight: 24 }}
          onBlur={onBlur}
          onPress={() => onChange(!value)}
          testID={testID}
          title={label}
        />
      )}
    />
  );
};
