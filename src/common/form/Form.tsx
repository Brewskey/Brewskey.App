import React, { PropsWithChildren } from 'react';
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  UseFormReturn,
  useForm,
} from 'react-hook-form';

type FormProps<TFormFields extends FieldValues> = {
  defaultValues?: DefaultValues<TFormFields>;
  form?: UseFormReturn<TFormFields>;
};

export const Form = <TFormFields extends FieldValues>({
  defaultValues,
  children,
  form: outerFormSetup,
}: PropsWithChildren<FormProps<TFormFields>>) => {
  const form =
    outerFormSetup ??
    useForm<TFormFields>({
      defaultValues,
    });

  return <FormProvider {...form}>{children}</FormProvider>;
};
