// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import LoginForm from '../components/LoginForm';

type Props = {|
  navigation: Navigation,
|};

class LoginScreen extends React.Component<Props> {
  render(): React.Node {
    return <LoginForm />;
  }
}

export default LoginScreen;
