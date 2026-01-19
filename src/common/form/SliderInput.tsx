import { Slider, SliderProps } from '@rneui/themed';
import { Controller, useFormContext } from 'react-hook-form';
import { COLORS } from '../../theme';
import nullthrows from 'nullthrows';

export type SliderInputProps = Omit<SliderProps, 'value'> & {
  name: string;
  defaultValue?: number;
  required?: boolean;
};

export const SliderInput = ({
  defaultValue,
  required = false,
  name,
  ...props
}: SliderInputProps) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={nullthrows(name, 'SliderInput: name prop is required and must be a non-empty string')}
      defaultValue={defaultValue ?? 0}
      rules={{ required }}
      render={({ field: { onChange, value } }) => (
        <Slider
          {...props}
          onValueChange={onChange}
          value={typeof value === 'number' ? value : 0}
          thumbTintColor={COLORS.primary}
          thumbStyle={{
            width: 24,
            height: 24,
          }}
          thumbTouchSize={{
            width: 30,
            height: 30,
          }}
        />
      )}
    />
  );
};
