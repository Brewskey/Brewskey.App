// @flow

import type { ObservableMap } from 'mobx';
import type { Field, ValidationFunction } from './types';

import * as React from 'react';
import debounce from 'lodash.debounce';
import { action, computed, observable } from 'mobx';

const FIELD_VALIDATION_DEBOUNCE_TIMEOUT = 700;
const FORM_ERROR_KEY = '_error';

type FormStoreProps<TObject> = {|
  validate?: ValidationFunction<TObject>,
|};

type InitFieldProps = {|
  initialValue?: any,
  name: string,
  parseOnSubmit?: (value: any) => any,
|};

// todo change touched logic so it takes care about initialValue
class FormStore<TValidate: {}> {
  _validate: ValidationFunction<TValidate>;
  @observable _fields: ObservableMap<string, Field> = observable.map();

  @observable formError: ?string = null;
  @observable submitting: boolean = false;

  constructor({
    validate = (): { [key: string]: string } => ({}: any),
  }: FormStoreProps<TValidate>) {
    this._validate = validate;
  }

  fieldSubmitEditing: (string) => void = (nextFocusTo: string): void => {
    const field = this._fields.get(nextFocusTo);
    if (!field || !field.refElement || !field.refElement.focus) {
      return;
    }

    field.refElement.focus();
  };

  @action
  initField: (InitFieldProps) => void = ({
    initialValue,
    name,
    parseOnSubmit = <TEntity>(value: TEntity): TEntity => value,
  }: InitFieldProps): void => {
    console.log(initialValue);
    this._fields.set(name, {
      error: null,
      initialValue,
      parseOnSubmit,
      touched: false,
      value: initialValue,
    });
  };

  @action
  blurField: ($Keys<TValidate>) => void = (fieldName: $Keys<TValidate>) => {
    this.validateField(fieldName);
    this.updateFieldProps(fieldName, { touched: true });
  };

  @action
  changeFieldValue: ($Keys<TValidate>, any) => void = (
    fieldName: $Keys<TValidate>,
    value: any,
  ) => {
    this.updateFieldProps(fieldName, { error: null, touched: true, value });
    this.validateFieldDebounced(fieldName);
  };

  @action
  updateFieldProps: ($Keys<TValidate>, $Shape<Field>) => void = (
    fieldName: $Keys<TValidate>,
    props: $Shape<Field>,
  ) => {
    const field = this._fields.get(fieldName);
    if (!field) {
      return;
    }

    this._fields.set(fieldName, ({ ...field, ...props }: $FlowFixMe));
  };

  @action
  setFieldError: ($Keys<TValidate>, string) => void = (
    fieldName: $Keys<TValidate>,
    error: string,
  ) => {
    const field = this._fields.get(fieldName);
    if (!field) {
      return;
    }

    this._fields.set(fieldName, ({ ...field, error }: $FlowFixMe));
  };

  @action
  setFieldRefElement: ($Keys<TValidate>, React.Node) => void = (
    fieldName: $Keys<TValidate>,
    refElement: React.Node,
  ) => {
    const field = this._fields.get(fieldName);
    if (!field) {
      return;
    }

    this._fields.set(fieldName, ({ ...field, refElement }: $FlowFixMe));
  };

  @action
  setFormError: (?string) => void = (error: ?string) => {
    this.formError = error;
  };

  @action
  setSubmitting: (boolean) => void = (submitting: boolean) => {
    this.submitting = submitting;
  };

  @action
  validate: () => void = () => {
    const errors = this._validate(this.values);

    Object.entries(errors).forEach(([key, value]: [string, mixed]) => {
      const castedValue = ((value: any): string);
      if (key === FORM_ERROR_KEY) {
        this.setFormError(castedValue);
        return;
      }
      this.updateFieldProps((key: any), { error: castedValue, touched: true });
    });
  };

  @action
  validateField: ($Keys<TValidate>) => void = (fieldName: $Keys<TValidate>) => {
    const errors = this._validate(this.values);
    const fieldError = errors[fieldName];
    if (fieldError) {
      this.updateFieldProps(fieldName, { error: fieldError, touched: true });
    }
  };

  @action
  validateFieldDebounced: ($Keys<TValidate>) => void = debounce(
    this.validateField,
    FIELD_VALIDATION_DEBOUNCE_TIMEOUT,
  );

  @computed
  get invalid(): boolean {
    const errors = Object.values(this._validate(this.values));
    return (
      Array.from(this._fields.toJS().values()).some(
        (field: Field): boolean => !!field.error,
      ) || errors.length !== 0
    );
  }

  @computed
  get pristine(): boolean {
    return !Array.from(this._fields.toJS().values()).some(
      ({ value, initialValue, parseOnSubmit }: Field): boolean =>
        parseOnSubmit(value) !== parseOnSubmit(initialValue),
    );
  }

  @computed
  get values(): Object {
    return Array.from(this._fields.toJS().entries()).reduce(
      (result: Object, [fieldName, field]: [string, Field]): Object => ({
        ...result,
        [fieldName]: field.value,
      }),
      {},
    );
  }

  @computed
  get submittingValues(): Object {
    return Array.from(this._fields.toJS().entries()).reduce(
      (result: Object, [fieldName, field]: [string, Field]): Object => ({
        ...result,
        [fieldName]: field.parseOnSubmit(field.value),
      }),
      {},
    );
  }

  getFieldError: ($Keys<TValidate>) => ?string = (
    fieldName: $Keys<TValidate>,
  ): ?string => {
    const field = this._fields.get(fieldName);
    return field && field.touched ? field.error : null;
  };

  getFieldTouched: ($Keys<TValidate>) => boolean = (
    fieldName: $Keys<TValidate>,
  ): boolean => {
    const field = this._fields.get(fieldName);
    return field ? field.touched : false;
  };

  getFieldValue: ($Keys<TValidate>) => any = (
    fieldName: $Keys<TValidate>,
  ): any => {
    const field = this._fields.get(fieldName);
    return field ? field.value : null;
  };
}

export default FormStore;
