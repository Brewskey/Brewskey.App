// @flow

import type RootStore from '../stores/RootStore';

import * as React from 'react';
import { inject } from 'mobx-react';
import AppLoading from '../components/AppLoading';

type Props = {|
  navigation: Object,
  rootStore: RootStore,
|};

@inject('rootStore')
class SplashScreen extends React.Component<Props> {
  async componentDidMount(): Promise<void> {
    await this.props.rootStore.initialize();
  }

  render(): React.Element<*> {
    return <AppLoading />;
  }
}

export default SplashScreen;
