import * as React from 'react';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Container } from '../../common/Container';
import { withErrorBoundary } from '../../common/ErrorBoundary';
import { ErrorScreen } from '../../common/ErrorScreen';
import { Header } from '../../common/Header';
import { RegisterForm } from '../../components/RegisterForm';

const RegisterScreen: React.FC = () => (
  <Container>
    <Header shouldShowBackButton title="Register account" />
    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
      <RegisterForm />
    </KeyboardAwareScrollView>
  </Container>
);

export default withErrorBoundary(
  RegisterScreen,
  <ErrorScreen shouldShowBackButton />,
);
