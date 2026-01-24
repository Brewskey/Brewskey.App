import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Controller, useFormContext, RegisterOptions } from 'react-hook-form';
import { FormLabel } from './FormLabel';
import { COLORS, TYPOGRAPHY } from '../../theme';
import { FormValidationMessage } from './FormValidationMessage';
import { CheckBoxField } from './CheckBoxField';
import { TextInput } from './TextInput';
import { CheckBoxInput } from './CheckBoxInput';
import { DropdownInput } from './DropdownInput';
import { SliderInput } from './SliderInput';
import nullthrows from 'nullthrows';

export type Props<
  TComponent extends React.ComponentType<any>,
  TProps extends React.ComponentProps<TComponent>,
> = Omit<TProps, 'name' | 'label' | 'value' | 'onChange'> & {
  description?: string;
  name: string;
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  component?: TComponent | null;
  initialValue?: unknown;
  _parseOnSubmit?: (value: unknown) => unknown;
  rules?: RegisterOptions;
  required?: boolean | string;
};

const styles = StyleSheet.create({
  description: {
    ...TYPOGRAPHY.small,
    color: COLORS.textFaded,
    marginHorizontal: 20,
  },
});
export const FormField = <

  TComponent extends React.ComponentType<any>,
  TProps extends React.ComponentProps<TComponent>,
>({
  description,
  label,
  labelStyle,
  containerStyle,
  descriptionStyle,
  component: Component,
  name,
  initialValue,
  _parseOnSubmit,
  rules,
  required,
  ...props
}: Props<TComponent, TProps>) => {
  const formContext = useFormContext();
  const fieldName = nullthrows(name, 'FormField: name prop is required');

  // If no component, just register the field (hidden field)
  if (!Component) {
    if (formContext) {
      return (
        <Controller
          control={formContext.control}
          name={fieldName}
          defaultValue={initialValue}
          rules={rules}
          render={() => <></>}
        />
      );
    }
    return <></>;
  }

  // Check if component uses Controller internally (TextInput, CheckBoxInput, DropDownInput, SliderInput, or their wrappers)
  const usesInternalController =
    Component === TextInput ||
    Component === CheckBoxInput ||
    Component === CheckBoxField ||
    Component === DropdownInput ||
    Component === SliderInput;

  // Build validation rules
  const validationRules: RegisterOptions = {
    ...rules,
    ...(required && typeof required === 'string'
      ? { required: required }
      : required === true
        ? { required: `${label || fieldName} is required` }
        : {}),
  };

  return (
    <View
      style={
        containerStyle ?? {
          marginHorizontal: 16,
        }
      }
    >
      {label && <FormLabel labelStyle={labelStyle}>{label}</FormLabel>}
      {usesInternalController && formContext ? (
        // Components that use Controller internally need name prop
        <Component

          {...(props as any)}
          name={fieldName}
          defaultValue={initialValue}
          required={typeof required === 'boolean' ? required : required ? true : false}
          rules={rules || (required && typeof required === 'string' ? { required } : undefined)}
          testID={(props as any).testID}
        />
      ) : formContext ? (
        // Other components get wrapped in Controller
        <Controller
          control={formContext.control}
          name={fieldName}
          defaultValue={initialValue}
          rules={Object.keys(validationRules).length > 0 ? validationRules : undefined}
          render={({ field: { onChange, value } }) => (

            <Component {...(props as any)} name={fieldName} label={label} onChange={onChange} value={value} />
          )}
        />
      ) : (
        <Component {...(props as TProps)} />
      )}
      {description == null ? null : (
        <Text style={descriptionStyle ?? styles.description}>
          {description}
        </Text>
      )}
      {label && <FormValidationMessage fieldName={fieldName} />}
    </View>
  );
};
