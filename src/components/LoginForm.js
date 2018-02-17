// @flow

import type { FormProps } from '../common/form/types';
import type { UserCredentials } from '../authApi';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { observer } from 'mobx-react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormValidationMessage } from 'react-native-elements';
import Button from '../common/buttons/Button';
import AuthStore from '../stores/AuthStore';
import { form, FormField } from '../common/form';
import TextField from './TextField';

const validate = (values: UserCredentials): { [key: string]: string } => {
  const errors = {};
  if (!values.userName) {
    errors.userName = 'User name is required';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

type InjectedProps = FormProps;

@form({ validate })
@observer
class LoginForm extends InjectedComponent<InjectedProps> {
  _onSubmit = async (formValues: Object): Promise<void> => {
    await AuthStore.login(formValues);
  };

  _onSubmitButtonPress = (): Promise<void> =>
    this.injectedProps.handleSubmit(this._onSubmit);

  render() {
    const { formError, invalid, pristine, submitting } = this.injectedProps;
    return (
      <KeyboardAwareScrollView>
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          component={TextField}
          disabled={submitting}
          label="User name"
          name="userName"
          nextFocusTo="password"
        />
        <FormField
          autoCapitalize="none"
          autoCorrect={false}
          component={TextField}
          disabled={submitting}
          label="Password"
          inputRef={ref => (this._passwordInputRef = ref)}
          name="password"
          onSubmitEditing={this._onSubmitButtonPress}
          secureTextEntry
        />
        <FormValidationMessage>{formError}</FormValidationMessage>
        <Button
          disabled={submitting || invalid || pristine}
          onPress={this._onSubmitButtonPress}
          title="Log in"
        />
      </KeyboardAwareScrollView>
    );
  }
}

export default LoginForm;
