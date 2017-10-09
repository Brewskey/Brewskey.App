// @flow

import * as React from 'react';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react';

@inject('formStore')
@observer
class FormField extends React.Component {
  componentWillMount() {
    this.props.formStore.initField(this.props.name);
  }

  onBlur = (): void => this.props.formStore.blurField(this.props.name);

  onChange = (value: any): void =>
    this.props.formStore.changeFieldValue(this.props.name, value);

  render(): React.Element<*> {
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
