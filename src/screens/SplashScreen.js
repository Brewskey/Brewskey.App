// @flow

import * as React from 'react';
import { inject } from 'mobx-react';
import AppLoading from '../components/AppLoading';

@inject('authStore')
class SplashScreen extends React.Component {
  componentDidMount() {
    this.props.authStore.initialize();
  }

  render(): React.Element<any> {
    return <AppLoading />;
  }
}

export default SplashScreen;
