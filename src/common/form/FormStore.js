// @flow

import type { FormField } from '.types';

import { action, computed, observable } from 'mobx';

const FORM_ERROR_KEY = '_error';

type FormStoreProps = {|
  validate: ?(values: Object) => Object,
|};

class FormStore {
  _validate: (values: Object) => Object;
  @observable _fields: Map<string, Field> = new Map();

  @observable formError: ?string = null;
  @observable submitting: boolean = false;

  constructor({ validate = (): Object => ({}) }: FormStoreProps) {
    this._validate = validate;
  }

  @action
  initField = (fieldName: string) => {
    this._fields.set(fieldName, {
      error: null,
      touched: false,
      value: null,
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
  get values(): Object {
    return this._fields.entries().reduce(
      (result: Object, [fieldName, field]: [string, Field]): Object => ({
        ...result,
        [fieldName]: field.value,
      }),
      {},
    );
  }

  // todo remove all that field existing checking code duplication
  getFieldError = (fieldName: string): any => {
    const field = this._fields.get(fieldName);
    return field && field.touched ? field.error : null;
  };

  getFieldTouched = (fieldName: string): any => {
    const field = this._fields.get(fieldName);
    return field ? field.touched : false;
  };

  getFieldValue = (fieldName: string): any => {
    const field = this._fields.get(fieldName);
    return field ? field.value : null;
  };
}

export default FormStore;
