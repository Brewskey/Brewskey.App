// @flow

import type WifiSetupStore from '../stores/WifiSetupStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import WifiList from '../components/WifiSetup/WifiList';

type InjectedProps = {
  wifiSetupStore: WifiSetupStore,
};

@flatNavigationParamsAndScreenProps
class WifiSetupStep3Screen extends InjectedComponent<InjectedProps> {
  render() {
    const { wifiSetupStore } = this.injectedProps;
    // todo add Hidden network input
    return (
      <WifiList
        isConnecting={wifiSetupStore.isConnecting}
        onConnectPress={wifiSetupStore.setupWifi}
        wifiSetupLoader={wifiSetupStore.wifiSetupLoader}
      />
    );
  }
}

export default WifiSetupStep3Screen;
