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

  _onBlur = (): void => this.props.formStore.blurField(this.props.name);

  _onChange = (value: any): void =>
    this.props.formStore.changeFieldValue(this.props.name, value);

  render(): React.Node {
    const { component: Component } = this.props;
    if (!Component) {
      return null;
    }

    return (
      <Component
        {...this.props}
        error={this.props.formStore.getFieldError(this.props.name)}
        onBlur={this._onBlur}
        onChange={this._onChange}
        touched={this.props.formStore.getFieldTouched(this.props.name)}
        value={this.props.formStore.getFieldValue(this.props.name)}
      />
    );
  }
}

export default FormField;
