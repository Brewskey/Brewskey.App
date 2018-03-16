// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import Container from '../common/Container';
import LoginForm from '../components/LoginForm';

type Props = {|
  navigation: Navigation,
|};

class LoginScreen extends React.Component<Props> {
  render() {
    return (
      <Container>
        <LoginForm />
      </Container>
    );
  }
}

export default LoginScreen;
