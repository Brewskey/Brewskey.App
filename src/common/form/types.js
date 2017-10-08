// @flow

export type Field = {|
  error: ?string,
  touched: boolean,
  value: any,
|};

export type FormChildProps = {|
  formError: ?string,
  handleSubmit: (onSubmit: (values: Object) => void | Promise<void>) => void,
  invalid: boolean,
  submitting: boolean,
|};

export type FormFieldChildProps = {|
  error: ?string,
  onBlur: () => void,
  onChange: (value: any) => void,
  touched: boolean,
  value: any,
|};
