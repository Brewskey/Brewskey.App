// @flow

import * as React from 'react';
import RNSplashScreen from 'react-native-splash-screen';
import Container from '../common/Container';
import AppLoading from '../components/AppLoading';

class SplashScreen extends React.Component<{}> {
  componentDidMount() {
    RNSplashScreen.hide();
  }

  render() {
    return (
      <Container>
        <AppLoading />
      </Container>
    );
  }
}

export default SplashScreen;
