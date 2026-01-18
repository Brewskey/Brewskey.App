import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import Container from '../common/Container';
import AppLoading from '../components/AppLoading';

const SplashScreenComponent: React.FC = () => {
  React.useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Container>
      <AppLoading />
    </Container>
  );
};

export default SplashScreenComponent;
