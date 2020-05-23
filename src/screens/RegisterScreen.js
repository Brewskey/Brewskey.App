// @flow

import * as React from 'react';
import ErrorScreen from '../common/ErrorScreen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { errorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import RegisterForm from '../components/RegisterForm';

@errorBoundary(<ErrorScreen showBackButton />)
class RegisterScreen extends React.Component<{}> {
  render(): React.Node {
    return (
      <Container>
        <Header showBackButton title="Register account" />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <RegisterForm />
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

export default RegisterScreen;
