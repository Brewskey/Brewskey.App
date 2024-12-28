import { Controller, useFormContext } from 'react-hook-form';
import { Dropdown as RNEDropdown } from 'react-native-element-dropdown';
import { DropdownProps } from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';

type Props<TValueType> = Omit<DropdownProps<TValueType>, 'onChange'> & {
  defaultValue?: TValueType;
  name: string;
  required?: boolean;
};

export const Dropdown = <TValueType,>({
  defaultValue,
  name,
  required = false,
  ...props
}: Props<TValueType>) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{ required }}
      render={({ field: { onChange, onBlur, value } }) => (
        <RNEDropdown<TValueType>
          {...props}
          value={value}
          onBlur={onBlur}
          onChange={(item) => {
            onChange(item);
          }}
        />
      )}
    />
  );
};
