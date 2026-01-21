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
  validate?: Record<string, (value: unknown) => true | string>;
};

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        form.register(fieldName as any, {
          validate: validate[fieldName],
        });
      });
    }
  }, [validate, form, outerFormSetup]);

  return <FormProvider {...form}>{children}</FormProvider>;
};
