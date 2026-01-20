import { Controller, useFormContext } from 'react-hook-form';
import { CheckBox, CheckBoxProps } from '@rneui/themed';
import { COLORS } from '../../theme';
import nullthrows from 'nullthrows';

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
      name={nullthrows(name, 'CheckBoxInput: name prop is required and must be a non-empty string')}
      defaultValue={defaultValue ?? false}
      rules={{ required }}
      render={({ field: { onChange, onBlur, value } }) => (
        <CheckBox
          {...props}
          checkedColor={COLORS.primary}
          title={label}
          containerStyle={{ marginLeft: 24, marginRight: 24 }}
          onBlur={onBlur}
          onPress={() => onChange(!value)}
          checked={value}
          testID={testID}
        />
      )}
    />
  );
};
