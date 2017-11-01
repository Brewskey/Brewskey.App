// @flow

import type RootStore from '../stores/RootStore';

import * as React from 'react';
import { inject } from 'mobx-react';
import AppLoading from '../components/AppLoading';

type Props = {|
  navigation: Navigation,
  rootStore: RootStore,
|};

@inject('rootStore')
class SplashScreen extends React.Component<Props> {
  componentDidMount() {
    this.props.rootStore.initialize();
  }

  render(): React.Node {
    return <AppLoading />;
  }
}

export default SplashScreen;
