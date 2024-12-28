import * as React from 'react';
import RNSplashScreen from 'react-native-splash-screen';
import Container from '../common/Container';
import AppLoading from '../components/AppLoading';

class SplashScreen extends React.Component<Record<any, any>> {
  componentDidMount() {
    RNSplashScreen.hide();
  }

  render(): React.ReactElement {
    return (
      <Container>
        <AppLoading />
      </Container>
    );
  }
}

export default SplashScreen;
