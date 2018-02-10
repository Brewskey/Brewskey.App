// @flow

import type WifiSetupStore from '../stores/WifiSetupStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import DeviceSetupInstructions from '../components/WifiSetup/DeviceSetupInstructions';

type InjectedProps = {
  wifiSetupStore: WifiSetupStore,
};

@flatNavigationParamsAndScreenProps
class WifiSetupStep1Screen extends InjectedComponent<InjectedProps> {
  render() {
    const { wifiSetupStore } = this.injectedProps;
    return (
      <DeviceSetupInstructions onReadyPress={wifiSetupStore.onStep1Ready} />
    );
  }
}

export default WifiSetupStep1Screen;
