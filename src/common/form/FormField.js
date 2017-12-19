// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

// todo add generic types for value
type Props = {
  children?: React.Node | Function,
  component?: React.ComponentType<any>,
  format: (value: any) => any,
  initialValue?: any,
  name: string,
  parse: (value: any) => any,
};

@observer
class FormField<TProps> extends React.Component<Props & TProps> {
  static defaultProps = {
    format: (value: any): any => value,
    parse: (value: any): any => value,
  };

  static contextTypes = {
    formStore: PropTypes.object,
  };

  componentWillMount() {
    this.context.formStore.initField({
      initialValue: this.props.initialValue,
      name: this.props.name,
    });
  }

  componentWillReceiveProps(nextProps: Props & TProps) {
    if (nextProps.initialValue !== this.props.initialValue) {
      this.context.formStore.initField({
        initialValue: nextProps.initialValue,
        name: nextProps.name,
      });
    }
  }

  _onBlur = (): void => this.context.formStore.blurField(this.props.name);

  _onChange = (value: any): void =>
    this.context.formStore.changeFieldValue(
      this.props.name,
      this.props.parse(value),
    );

  render() {
    const { component: Component } = this.props;
    if (!Component) {
      return null;
    }

    return (
      <Component
        error={this.context.formStore.getFieldError(this.props.name)}
        onBlur={this._onBlur}
        onChange={this._onChange}
        touched={this.context.formStore.getFieldTouched(this.props.name)}
        value={this.props.format(
          this.context.formStore.getFieldValue(this.props.name),
        )}
        {...this.props}
      />
    );
  }
}

export default FormField;
