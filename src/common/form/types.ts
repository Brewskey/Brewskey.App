// todo figure out how we can use generic TValue for
// value and initialValue props
export type Field = {
  error: string | null | undefined;
  initialValue: any;
  parseOnSubmit: (value?: any) => any;
  refElement?: any;
  touched: boolean;
  value: any;
};

export type FormProps<TFormFields> = {
  formError: string | null | undefined;
  getFieldError: (fieldName: string) => string | null | undefined;
  getFieldTouched: (fieldName: string) => boolean;
  handleSubmit: (
    onSubmit: (values: TFormFields) => TFormFields | Promise<TFormFields>,
  ) => Promise<void>;
  invalid: boolean;
  pristine: boolean;
  submitting: boolean;
  values: TFormFields;
};

export type FormFieldChildProps = {
  error: string | null | undefined;
  onBlur: () => void;
  onChange: (value?: any) => void;
  touched: boolean;
  value: any;
};

export type ValidationFunction<TObject> = (
  values: TObject,
) => Partial<Record<keyof TObject, string | null>>;
