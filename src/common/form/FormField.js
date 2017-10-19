// @flow

import type FormStore from './FormStore';

import * as React from 'react';
import { inject, observer } from 'mobx-react';

type Props = {|
  formStore: FormStore,
  initialValue?: any,
  name: string,
|};

@inject('formStore')
@observer
class FormField extends React.Component<Props> {
  componentWillMount() {
    this.props.formStore.initField({
      initialValue: this.props.initialValue,
      name: this.props.name,
    });
  }

  onBlur = (): void => this.props.formStore.blurField(this.props.name);

  onChange = (value: any): void =>
    this.props.formStore.changeFieldValue(this.props.name, value);

  render(): ?React.Element<*> {
    if (!this.props.children) {
      return null;
    }
    if (!this.props.children.call) {
      throw new Error('FormField children should be a function or null');
    }
    return this.props.children({
      error: this.props.formStore.getFieldError(this.props.name),
      onBlur: this.onBlur,
      onChange: this.onChange,
      touched: this.props.formStore.getFieldTouched(this.props.name),
      value: this.props.formStore.getFieldValue(this.props.name),
    });
  }
}

export default FormField;
