// @flow

import type { Field, ValidateFunction } from './types';

import { action, computed, createTransformer, observable } from 'mobx';

const FORM_ERROR_KEY = '_error';

type FormStoreProps = {|
  validate: ?ValidateFunction,
|};

type InitFieldProps = {|
  name: string,
  initialValue?: any,
|};

// todo change touched logic so it takes care about initialValue
class FormStore {
  _validate: ValidateFunction;
  @observable _fields: Map<string, Field> = new Map();

  @observable formError: ?string = null;
  @observable submitting: boolean = false;

  constructor({
    validate = (): { [key: string]: string } => ({}),
  }: FormStoreProps) {
    this._validate = validate;
  }

  @action
  initField = ({ name, initialValue }: InitFieldProps) => {
    this._fields.set(name, {
      error: null,
      initialValue,
      touched: false,
      value: initialValue,
    });
  };

  @action
  blurField = (fieldName: string) => {
    this.validateField(fieldName);
    this.updateFieldProps(fieldName, { touched: true });
  };

  @action
  changeFieldValue = (fieldName: string, value: any) => {
    this.updateFieldProps(fieldName, { error: null, touched: true, value });
    this.validateField(fieldName);
  };

  @action
  updateFieldProps = (fieldName: string, props: $Shape<Field>) => {
    const field = this._fields.get(fieldName);
    if (!field) {
      return;
    }

    this._fields.set(fieldName, { ...field, ...props });
  };

  @action
  setFieldError = (fieldName: string, error: string) => {
    const field = this._fields.get(fieldName);
    if (!field) {
      return;
    }

    this._fields.set(fieldName, { ...field, error });
  };

  @action
  setFormError = (error: string) => {
    this.formError = error;
  };

  @action
  setSubmitting = (submitting: boolean) => {
    this.submitting = submitting;
  };

  @action
  validate = () => {
    const errors = this._validate(this.values);

    Object.entries(errors).forEach(([key, value]: [string, string]) => {
      if (key === FORM_ERROR_KEY) {
        this.setFormError(value);
        return;
      }
      this.updateFieldProps(key, { error: value, touched: true });
    });
  };

  @action
  validateField = (fieldName: string) => {
    const errors = this._validate(this.values);
    const fieldError = errors[fieldName];
    if (fieldError) {
      this.updateFieldProps(fieldName, { error: fieldError, touched: true });
    }
  };

  @computed
  get invalid(): boolean {
    return this._fields.values().some((field: Field): boolean => !!field.error);
  }

  @computed
  get pristine(): boolean {
    return !this._fields
      .values()
      .some((field: Field): boolean => field.value !== field.initialValue);
  }

  @computed
  get values(): Object {
    return this._fields.entries().reduce(
      (result: Object, [fieldName, field]: [string, Field]): Object => ({
        ...result,
        [fieldName]: field.value,
      }),
      {},
    );
  }

  getFieldError = createTransformer((fieldName: string): ?string => {
    const field = this._fields.get(fieldName);
    return field && field.touched ? field.error : null;
  });

  getFieldTouched = createTransformer((fieldName: string): boolean => {
    const field = this._fields.get(fieldName);
    return field ? field.touched : false;
  });

  getFieldValue = createTransformer((fieldName: string): any => {
    const field = this._fields.get(fieldName);
    return field ? field.value : null;
  });
}

export default FormStore;
