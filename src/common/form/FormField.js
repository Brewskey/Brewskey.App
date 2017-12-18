// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

type Props = {
  children?: React.Node | Function,
  component?: React.ComponentType<any>,
  format: <TInput, TOutput>(value: TInput) => TOutput,
  initialValue?: any,
  name: string,
  parse: <TInput, TOutput>(value: TInput) => TOutput,
};

@observer
class FormField<TProps> extends React.Component<Props & TProps> {
  static defaultProps = {
    format: <TInput, TOutput>(value: TInput): TOutput => value,
    parse: <TInput, TOutput>(value: TInput): TOutput => value,
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
