// @flow

import * as React from 'react';
import LoginForm from '../components/LoginForm';

type Props = {|
  navigation: Object,
|};

class LoginScreen extends React.Component<Props> {
  render(): React.Element<*> {
    return <LoginForm />;
  }
}

export default LoginScreen;
