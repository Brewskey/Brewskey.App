// @flow

import type { FormProps, ValidationFunction } from './types';

import * as React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { observer } from 'mobx-react';
import FormStore from './FormStore';

type FormSetupProps = {|
  validate?: ValidationFunction,
|};

const form = ({ validate }: FormSetupProps = {}): Function => <TProps>(
  Component: React.ComponentType<TProps>,
): React.ComponentType<TProps & FormProps> => {
  @observer
  class Form extends React.Component<Props> {
    static childContextTypes = {
      formStore: PropTypes.object,
    };

    _formStore: FormStore;

    componentWillMount() {
      this._formStore = new FormStore({ validate });
    }

    getChildContext(): { formStore: FormStore } {
      return {
        formStore: this._formStore,
      };
    }

    _handleSubmit = async (
      callback: (values: { [key: string]: any }) => void | Promise<void>,
    ): Promise<void> => {
      this._formStore.setFormError(null);
      this._formStore.validate();
      if (this._formStore.invalid) {
        return;
      }

      try {
        this._formStore.setSubmitting(true);
        const result = callback.call
          ? callback(this._formStore.values)
          : this.props.onSubmit(this._formStore.values);

        if (result && result.then) {
          await result;
        }
      } catch (error) {
        // todo what if no mesage in error?
        this._formStore.setFormError(error.message);
      } finally {
        this._formStore.setSubmitting(false);
      }
    };

    render(): React.Node {
      return (
        <Component
          {...this.props}
          formError={this._formStore.formError}
          getFieldError={this._formStore.getFieldError}
          getFieldTouched={this._formStore.getFieldTouched}
          handleSubmit={this._handleSubmit}
          invalid={this._formStore.invalid}
          pristine={this._formStore.pristine}
          submitting={this._formStore.submitting}
          values={this._formStore.values}
        />
      );
    }
  }

  hoistNonReactStatic(Form, Component);
  return Form;
};

export default form;
