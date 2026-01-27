import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { FormLabel } from './FormLabel';
import { FormValidationMessage } from './FormValidationMessage';
import { COLORS, TYPOGRAPHY } from '../../theme';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type Props<
  TComponent extends React.ComponentType<any>,
  TProps extends React.ComponentProps<TComponent>,
> = TProps & {
  description?: string | React.ReactNode;
  label?: string;
  name: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  component: TComponent;
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
  ...props
}: Props<TComponent, TProps>) => (
  <View
    style={
      containerStyle ?? {
        marginHorizontal: 16,
      }
    }
  >
    {label ? <FormLabel labelStyle={labelStyle}>{label}</FormLabel> : null}
    <Component {...props} />
    {description == null ? null : typeof description === 'string' ? (
      <Text style={descriptionStyle ?? styles.description}>{description}</Text>
    ) : (
      description
    )}
    {label ? <FormValidationMessage fieldName={props.name} /> : null}
  </View>
);
