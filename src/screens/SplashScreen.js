// @flow

import type AuthStore from '../stores/AuthStore';

import * as React from 'react';
import { inject } from 'mobx-react';
import AppLoading from '../components/AppLoading';

type Props = {|
  authStore: AuthStore,
  navigation: Object,
|};

@inject('authStore')
class SplashScreen extends React.Component {
  componentDidMount() {
    this.props.authStore.initialize();
  }

  render(): React.Element<*> {
    return <AppLoading />;
  }
}

export default SplashScreen;
