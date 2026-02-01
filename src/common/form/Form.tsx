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
}

export const Form = <TFormFields extends FieldValues>({
  defaultValues,
  children,
  form: outerFormSetup,
}: PropsWithChildren<FormProps<TFormFields>>) => {
  const innerForm = useForm<TFormFields>({ defaultValues });
  const form = outerFormSetup ?? innerForm;

  return <FormProvider {...form}>{children}</FormProvider>;
};
