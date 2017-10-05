// @flow

import * as React from 'react';
import { Text, View } from 'react-native';
import LoginForm from '../containers/LoginForm';
import { inject } from 'mobx-react/native';

class LoginScreen extends React.Component {
  render() {
    return <LoginForm />;
  }
}

export default LoginScreen;
