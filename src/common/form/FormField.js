// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

type Props = {
  children?: React.Node,
  initialValue?: any,
  name: string,
};

@observer
class FormField extends React.Component<Props> {
  static contextTypes = {
    formStore: PropTypes.object,
  };

  componentWillMount() {
    this.context.formStore.initField({
      initialValue: this.props.initialValue,
      name: this.props.name,
    });
  }

  _onBlur = (): void => this.context.formStore.blurField(this.props.name);

  _onChange = (value: any): void =>
    this.context.formStore.changeFieldValue(this.props.name, value);

  render(): React.Node {
    const { component: Component } = this.props;
    if (!Component) {
      return null;
    }

    return (
      <Component
        {...this.props}
        error={this.context.formStore.getFieldError(this.props.name)}
        onBlur={this._onBlur}
        onChange={this._onChange}
        touched={this.context.formStore.getFieldTouched(this.props.name)}
        value={this.context.formStore.getFieldValue(this.props.name)}
      />
    );
  }
}

export default FormField;
