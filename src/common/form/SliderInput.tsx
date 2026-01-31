import { Slider } from '@rneui/themed';
import nullthrows from 'nullthrows';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { View } from 'react-native';

import { COLORS } from 'theme';

import type { SliderProps } from '@rneui/themed';

export type SliderInputProps<TFormFields extends FieldValues> = Omit<
  SliderProps,
  'value' | 'name'
> & {
  name: Extract<keyof TFormFields, string>;
  defaultValue?: number;
  required?: boolean;
  testID?: string;
};

export const SliderInput = <TFormFields extends FieldValues>({
  defaultValue,
  required = false,
  name,
  testID,
  ...props
}: SliderInputProps<TFormFields>) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      defaultValue={defaultValue ?? 0}
      rules={{ required }}
      name={nullthrows(
        name.toString(),
        'SliderInput: name prop is required and must be a non-empty string',
      )}
      render={({ field: { onChange, onBlur, value } }) => (
        <View testID={testID}>
          <Slider
            {...props}
            thumbTintColor={COLORS.primary}
            value={typeof value === 'number' ? value : 0}
            onSlidingComplete={(newValue) => {
              onChange(newValue);
              onBlur();
            }}
            onValueChange={(newValue) => {
              onChange(newValue);
              // Ensure form is marked as dirty when slider value changes
              // Controller's onChange should handle this, but we call onBlur to ensure proper form state
            }}
            thumbStyle={{
              width: 24,
              height: 24,
            }}
            thumbTouchSize={{
              width: 30,
              height: 30,
            }}
          />
        </View>
      )}
    />
  );
};
