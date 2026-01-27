import React from 'react';

import { FormProvider, useForm } from 'react-hook-form';

import type { PropsWithChildren } from 'react';
import type {
  DefaultValues,
  FieldValues,
  Path,
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
  const innerForm = useForm<TFormFields>({ defaultValues });
  const form = outerFormSetup ?? innerForm;

  // Register fields with validation if validate prop is provided
  React.useEffect(() => {
    if (validate && !outerFormSetup) {
      Object.keys(validate).forEach((fieldName) => {
        form.register(fieldName as unknown as Path<TFormFields>, {
          validate: validate[fieldName],
        });
      });
    }
  }, [validate, form, outerFormSetup]);

  return <FormProvider {...form}>{children}</FormProvider>;
};
