// @flow

import * as React from 'react';
import { inject, observer } from 'mobx-react/native';
import { action, observable } from 'mobx';
import LoginForm from '../components/LoginForm';
import { login } from '../authApi';

// todo use mobx-react-form instead?
@inject('authStore')
@inject('errorStore')
@observer
class LoginFormContainer extends React.Component {
  @observable userName = '';
  @observable password = '';
  @observable loginError = '';

  @action
  changeUserName = (value: string) => {
    this.userName = value;
  };

  @action
  changePassword = (value: string) => {
    this.password = value;
  };

  @action
  setLoginError = (error: string) => {
    this.loginError = error;
  };

  onSubmit = async () => {
    try {
      // todo move api call to authStore?
      const authResponse = await login({
        password: this.password,
        userName: this.userName,
      });

      const authState = {
        roles: JSON.parse(authResponse.roles),
        token: authResponse.access_token,
        userName: authResponse.userName,
      };
      this.props.authStore.setAuthState(authState);
    } catch (error) {
      this.setLoginError(error.message);
    }
  };

  render() {
    return (
      <LoginForm
        loginError={this.loginError}
        onChangePassword={this.changePassword}
        onChangeUserName={this.changeUserName}
        onSubmit={this.onSubmit}
        password={this.password}
        userName={this.userName}
      />
    );
  }
}

export default LoginFormContainer;
