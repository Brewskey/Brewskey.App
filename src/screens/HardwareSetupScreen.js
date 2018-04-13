// @flow

import type { Navigation } from '../types';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import HardwareSetupGuide from '../components/HardwareSetupGuide';

type InjectedProps = {|
  navigation: Navigation,
|};

class HardwareSetupScreen extends InjectedComponent<InjectedProps> {
  _onSkipPress = () => {
    // todo change when we come up with right place
    this.injectedProps.navigation.navigate('menu');
  };

  _onFinishPress = () => {
    // todo fill
  };

  render() {
    return (
      <HardwareSetupGuide
        onFinishPress={this._onFinishPress}
        onSkipPress={this._onSkipPress}
      />
    );
  }
}

export default HardwareSetupScreen;
