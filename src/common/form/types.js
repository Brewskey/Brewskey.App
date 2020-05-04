// @flow

// todo figure out how we can use generic TValue for
// value and initialValue props
export type Field = {|
  error: ?string,
  initialValue: any,
  parseOnSubmit: (value: any) => any,
  refElement?: any,
  touched: boolean,
  value: any,
|};

export type FormProps = {|
  formError: ?string,
  getFieldError: (fieldName: string) => ?string,
  getFieldTouched: (fieldName: string) => boolean,
  handleSubmit: (onSubmit: (values: Object) => any) => Promise<void>,
  invalid: boolean,
  pristine: boolean,
  submitting: boolean,
  values: Object,
|};

export type FormFieldChildProps = {|
  error: ?string,
  onBlur: () => void,
  onChange: (value: any) => void,
  touched: boolean,
  value: any,
|};

export type ValidationFunction<TObject> = <TObject>(
  values: TObject,
) => {| [key: $Keys<TObject>]: string |};
