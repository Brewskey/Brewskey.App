import * as React from 'react';
import ErrorScreen from '../common/ErrorScreen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Header from '../common/Header';
import RegisterForm from '../components/RegisterForm';

const RegisterScreen: React.FC = () => {
  return (
    <Container>
      <Header showBackButton title="Register account" />
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <RegisterForm />
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default withErrorBoundary(RegisterScreen, <ErrorScreen showBackButton />);
