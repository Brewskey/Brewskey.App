import * as React from 'react';

import { FieldValues } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { FormLabel } from 'common/form/FormLabel';
import { FormValidationMessage } from 'common/form/FormValidationMessage';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type Props<
  TFormFields extends FieldValues,
  TComponent extends React.ComponentType<any>,
> = React.ComponentProps<TComponent> & {
  description?: string | React.ReactNode;
  label?: string;
  name: Extract<keyof TFormFields, string>;
  required?: boolean | string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  component: TComponent;
};

type FormFieldPropsOrError<TFormFields, TComponent> = [TFormFields] extends [
  never,
]
  ? {
      __FORM_FIELD_REQUIRES_EXPLICIT_GENERICS: 'FormField<TFormFields, TComponent>({...})';
    }
  : [TComponent] extends [never]
    ? {
        __FORM_FIELD_REQUIRES_EXPLICIT_GENERICS: 'FormField<TFormFields, TComponent>({...})';
      }
    : Props<TFormFields & FieldValues, TComponent & React.ComponentType<any>>;

const styles = StyleSheet.create({
  description: {
    ...TYPOGRAPHY.small,
    color: COLORS.textFaded,
    marginHorizontal: 20,
  },
  /** Aligns React-node descriptions with string descriptions (same inset as inputs / label column). */
  descriptionNodeWrap: {
    marginHorizontal: 20,
  },
});
/**
 * Renders a form control with optional label, description, and validation message.
 * Both TFormFields and TComponent must be passed explicitly as type arguments.
 *
 * @typeParam TFormFields - Form values type (required; pass explicitly e.g. FormField<MyFormValues, MyComponent>({...}))
 * @typeParam TComponent - Component type (required; pass explicitly e.g. typeof TextInput)
 */
export const FormField = <
  TFormFields extends FieldValues = never,
  TComponent extends React.ComponentType<any> = never,
>({
  description,
  label,
  labelStyle,
  required,
  containerStyle,
  descriptionStyle,
  component: Component,
  ...props
}: FormFieldPropsOrError<TFormFields, TComponent>) => (
  <View
    style={
      containerStyle ?? {
        marginHorizontal: 16,
      }
    }
  >
    {label ? (
      <FormLabel labelStyle={labelStyle}>
        {label}
        {required ? ' *' : ''}
      </FormLabel>
    ) : null}
    <Component {...props} required={required} />
    {description != null &&
      (typeof description === 'string' ? (
        <Text style={descriptionStyle ?? styles.description}>
          {description}
        </Text>
      ) : (
        <View style={[styles.descriptionNodeWrap, descriptionStyle]}>
          {description}
        </View>
      ))}
    {label ? (
      <FormValidationMessage
        fieldName={props.name as Extract<keyof TFormFields, string>}
      />
    ) : null}
  </View>
);
