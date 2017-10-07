// @flow

import type AuthStore from '../stores/AuthStore';

import * as React from 'react';
import { Keyboard } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { action, computed, observable } from 'mobx';
import LoginForm from '../components/LoginForm';
import { login } from '../authApi';
import FormField from './FormField';

const validateUserName = (userName: ?stirng): ?string =>
  userName ? null : 'User name is required';

const validatePassword = (password: ?string): ?string =>
  password ? null : 'Password is required';

type Props = {|
  authStore: AuthStore,
|};

@inject('authStore')
@observer
class LoginFormContainer extends React.Component<Props> {
  userNameField = new FormField({
    name: 'userName',
    validate: validateUserName,
  });

  passwordField = new FormField({
    name: 'password',
    validate: validatePassword,
  });

  @observable loginError: ?string = '';
  @observable submitting: boolean = false;

  @action
  setLoginError = (error: string) => {
    this.loginError = error;
  };

  @action
  setSubmitting = (submitting: boolean) => {
    this.submitting = submitting;
  };

  onSubmit = async (): Promise<void> => {
    this.setSubmitting(true);
    try {
      Keyboard.dismiss();
      await this.props.authStore.login({
        password: this.passwordField.value,
        userName: this.userNameField.value,
      });
    } catch (error) {
      this.setLoginError(error.message);
    } finally {
      this.setSubmitting(false);
    }
  };

  render(): React.Element<*> {
    return (
      <LoginForm
        loginError={this.loginError}
        onSubmit={this.onSubmit}
        passwordField={this.passwordField}
        submitting={this.submitting}
        userNameField={this.userNameField}
      />
    );
  }
}

export default LoginFormContainer;
