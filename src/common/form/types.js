// @flow

// todo figure out how we can use generic TValue for
// value and initialValue props
export type Field = {|
  error: ?string,
  initialValue: any,
  touched: boolean,
  value: any,
|};

export type FormChildProps = {|
  formError: ?string,
  handleSubmit: (onSubmit: (values: Object) => void | Promise<void>) => void,
  invalid: boolean,
  pristine: boolean,
  submitting: boolean,
  values: Array<any>,
|};

export type FormFieldChildProps = {|
  error: ?string,
  onBlur: () => void,
  onChange: (value: any) => void,
  touched: boolean,
  value: any,
|};

export type ValidationFunction = (values: { [key: string]: any }) => {
  [key: string]: string,
};

export type FieldFocusManagerChildProps = {|
  addFieldRef: (index: number) => (ref: React.Element<any>) => void,
  focusField: (index: number) => () => void,
|};
