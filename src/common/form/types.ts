export interface Field<TValue = unknown> {
  error: string | null | undefined;
  initialValue: TValue;
  parseOnSubmit: (value?: TValue) => TValue;
  refElement?: React.RefObject<unknown>;
  touched: boolean;
  value: TValue;
}

export interface FormProps<TFormFields> {
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
}

export interface FormFieldChildProps<TValue = unknown> {
  error: string | null | undefined;
  onBlur: () => void;
  onChange: (value?: TValue) => void;
  touched: boolean;
  value: TValue;
}

export type ValidationFunction<TObject> = (
  values: TObject,
) => Partial<Record<keyof TObject, string | null>>;
