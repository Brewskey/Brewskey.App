// @flow

import { action, computed, observable } from 'mobx';

type FieldProps = {|
  name: string,
  validate?: (value: any) => ?string,
|};

class FormField {
  name: string;
  _validate: (value: any) => ?string;

  @observable value: any = undefined;
  @observable _pristine: boolean = true;

  constructor({ name, validate = () => '' }: FieldProps) {
    this.name = name;
    this._validate = validate;
  }

  @action
  onBlur = () => {
    this._pristine = false;
  };

  @action
  onChange = (value: any) => {
    this.value = value;
  };

  @computed
  get error(): ?string {
    return !this._pristine ? this._validate(this.value) : null;
  }
}

export default FormField;
