import React from 'react';

import { FormProvider, useForm } from 'react-hook-form';

import type { PropsWithChildren } from 'react';
import type {
  DefaultValues,
  FieldValues,
  UseFormReturn,
} from 'react-hook-form';

interface FormProps<TFormFields extends FieldValues> {
  defaultValues?: DefaultValues<TFormFields>;
  form?: UseFormReturn<TFormFields>;
  validate?: Record<string, (value: unknown) => true | string>;
}

export const Form = <TFormFields extends FieldValues>({
  defaultValues,
  children,
  form: outerFormSetup,
  validate,
}: PropsWithChildren<FormProps<TFormFields>>) => {
  const form =
    outerFormSetup ??
    useForm<TFormFields>({
      defaultValues,
    });

  // Register fields with validation if validate prop is provided
  React.useEffect(() => {
    if (validate && !outerFormSetup) {
      Object.keys(validate).forEach((fieldName) => {
        form.register(fieldName, {
          validate: validate[fieldName],
        });
      });
    }
  }, [validate, form, outerFormSetup]);

  return <FormProvider {...form}>{children}</FormProvider>;
};
