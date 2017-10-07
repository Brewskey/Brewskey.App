// @flow

import * as React from 'react';
import { Text, View } from 'react-native';
import LoginForm from '../containers/LoginForm';
import { inject } from 'mobx-react/native';

type Props = {|
  navigation: Object,
|};

class LoginScreen extends React.Component<Props> {
  render(): React.Element<*> {
    return <LoginForm />;
  }
}

export default LoginScreen;
