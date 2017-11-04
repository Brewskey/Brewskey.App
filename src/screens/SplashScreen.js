// @flow

import type { Navigation } from '../types';
import type RootStore from '../stores/RootStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { inject } from 'mobx-react';
import AppLoading from '../components/AppLoading';

type InjectedProps = {|
  navigation: Navigation,
  rootStore: RootStore,
|};

@inject('rootStore')
class SplashScreen extends InjectedComponent<InjectedProps> {
  componentDidMount() {
    this.injectedProps.rootStore.initialize();
  }

  render(): React.Node {
    return <AppLoading />;
  }
}

export default SplashScreen;
