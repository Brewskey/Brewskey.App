import * as React from 'react';

import { hideAsync } from 'expo-splash-screen';

import { Container } from 'common/Container';
import { AppLoading } from 'components/AppLoading';

const SplashScreenComponent: React.FC = () => {
  React.useEffect(() => {
    hideAsync();
  }, []);

  return (
    <Container>
      <AppLoading />
    </Container>
  );
};

export { SplashScreenComponent };
