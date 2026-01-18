import * as React from 'react';
import { TextInput, TextInputProps } from './TextInput';
import { FormField } from './FormField';

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
}) => {
  return (
    <FormField
      component={TextInput}
      label={label}
      description={description}
      containerStyle={containerStyle}
      labelStyle={labelStyle}
      descriptionStyle={descriptionStyle}
      {...textInputProps}
    />
  );
};
