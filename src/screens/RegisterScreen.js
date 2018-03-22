// @flow

import * as React from 'react';
import Container from '../common/Container';
import Header from '../common/Header';
import RegisterForm from '../components/RegisterForm';

class RegisterScreen extends React.Component {
  render() {
    return (
      <Container>
        <Header showBackButton title="register" />
        <RegisterForm />
      </Container>
    );
  }
}

export default RegisterScreen;
