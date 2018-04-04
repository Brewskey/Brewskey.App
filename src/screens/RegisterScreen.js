// @flow

import * as React from 'react';
import ErrorScreen from '../common/ErrorScreen';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import RegisterForm from '../components/RegisterForm';

@errorBoundary(<ErrorScreen showBackButton />)
class RegisterScreen extends React.Component<{}> {
  render() {
    return (
      <Container>
        <Header showBackButton title="Register account" />
        <RegisterForm />
      </Container>
    );
  }
}

export default RegisterScreen;
