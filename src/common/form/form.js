// @flow

import type { FormProps, ValidationFunction } from './types';

import * as React from 'react';
import { Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { observer } from 'mobx-react';
import FormStore from './FormStore';

type FormSetupProps<TObject> = {
  validate?: ValidationFunction<TObject>,
};

type OnSubmitCallbackFunction = (values: {
  [key: string]: any,
}) => void | Promise<any>;

type SubmitType = {| onSubmit?: OnSubmitCallbackFunction |};
const form = <TValidate>({ validate }: FormSetupProps<TValidate> = {}): (<
  TProps,
>(
  React.ComponentType<{| ...TProps, ...SubmitType, ...FormProps |}>,
) => React.ComponentType<{| ...TProps, ...SubmitType |}>) => <TProps>(
  Component: React.ComponentType<{| ...TProps, ...SubmitType, ...FormProps |}>,
): React.ComponentType<{| ...TProps, ...SubmitType |}> => {
  @observer
  class Form extends React.Component<{| ...TProps, ...SubmitType |}> {
    static childContextTypes = {
      formStore: PropTypes.object,
    };

    _formStore: FormStore<TValidate> = new FormStore({ validate });

    getChildContext(): { formStore: FormStore<TValidate> } {
      return {
        formStore: this._formStore,
      };
    }

    _handleSubmit = async (
      callback?: OnSubmitCallbackFunction,
    ): Promise<void> => {
      try {
        this._formStore.setFormError(null);
        this._formStore.validate();
        Keyboard.dismiss();

        if (this._formStore.invalid) {
          return;
        }

        const { onSubmit } = this.props;
        this._formStore.setSubmitting(true);

        const result =
          callback && typeof callback === 'function'
            ? callback(this._formStore.submittingValues)
            : onSubmit && onSubmit(this._formStore.submittingValues);

        if (result && result.then) {
          await result;
        }
      } catch (error) {
        // todo what if no message in error?
        this._formStore.setFormError(error.message);
      } finally {
        this._formStore.setSubmitting(false);
      }
    };

    render(): React.Node {
      return (
        <Component
          formError={this._formStore.formError}
          getFieldError={this._formStore.getFieldError}
          getFieldTouched={this._formStore.getFieldTouched}
          handleSubmit={this._handleSubmit}
          invalid={this._formStore.invalid}
          pristine={this._formStore.pristine}
          submitting={this._formStore.submitting}
          values={this._formStore.values}
          {...this.props}
        />
      );
    }
  }

  hoistNonReactStatic(Form, Component);
  return Form;
};

export default form;
