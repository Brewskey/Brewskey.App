import * as React from 'react';
import { CheckBoxInput, TextInputProps as CheckBoxInputProps } from './CheckBoxInput';

export type CheckBoxFieldProps = Omit<CheckBoxInputProps, 'defaultValue'> & {
  initialValue?: boolean;
};

export const CheckBoxField: React.FC<CheckBoxFieldProps> = ({
  initialValue,
  ...props
}) => <CheckBoxInput {...props} defaultValue={initialValue} />;
