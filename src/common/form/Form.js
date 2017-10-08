// @flow

import * as React from 'react';
import { Provider, observer } from 'mobx-react';
import FormStore from './FormStore';

@observer
class Form extends React.Component {
  formStore: FormStore;

  componentWillMount() {
    this.formStore = new FormStore({ validate: this.props.validate });
  }

  handleSubmit = async (
    callback: (values: Object) => void | Promise<void>,
  ): Promise<void> => {
    this.formStore.setFormError(null);
    this.formStore.validate();
    if (this.formStore.invalid) {
      return;
    }

    try {
      this.formStore.setSubmitting(true);
      const result = callback(this.formStore.values);
      if (result && result.then) {
        await result;
      }
    } catch (error) {
      // todo what if no mesage in error?
      this.formStore.setFormError(error.message);
    } finally {
      this.formStore.setSubmitting(false);
    }
  };

  render(): React.Element<*> {
    return (
      <Provider formStore={this.formStore}>
        {this.props.children({
          formError: this.formStore.formError,
          handleSubmit: this.handleSubmit,
          invalid: this.formStore.invalid,
          submitting: this.formStore.submitting,
        })}
      </Provider>
    );
  }
}

export default Form;
