import { CheckBox } from '@rneui/themed';
import nullthrows from 'nullthrows';
import { Controller, useFormContext } from 'react-hook-form';

import { COLORS } from '../../theme';

import type { CheckBoxProps } from '@rneui/themed';

export type TextInputProps = Omit<
  CheckBoxProps,
  'checked' | 'children' | 'onBlur' | 'title'
> & {
  label: string;
  name: string;
  defaultValue?: boolean;
  // validationTextStyle?: StyleProp<TextStyle>;
  required?: boolean;
  testID?: string;
};

export const CheckBoxInput = ({
  defaultValue,
  required = false,
  name,
  label,
  testID,
  ...props
}: TextInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      defaultValue={defaultValue ?? false}
      rules={{ required }}
      name={nullthrows(
        name,
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
