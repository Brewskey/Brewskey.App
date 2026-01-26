import * as React from 'react';

import { FormField } from './FormField';
import { TextInput } from './TextInput';

import type { TextInputProps } from './TextInput';

export type Props = Omit<TextInputProps, 'label'> & {
  label: string;
  description?: string;
  containerStyle?: React.ComponentProps<typeof FormField>['containerStyle'];
  labelStyle?: React.ComponentProps<typeof FormField>['labelStyle'];
  descriptionStyle?: React.ComponentProps<typeof FormField>['descriptionStyle'];
};

export const TextField: React.FC<Props> = ({
  label,
  description,
  containerStyle,
  labelStyle,
  descriptionStyle,
  ...textInputProps
}) => (
  <FormField
    component={TextInput}
    containerStyle={containerStyle}
    description={description}
    descriptionStyle={descriptionStyle}
    label={label}
    labelStyle={labelStyle}
    {...textInputProps}
  />
);
