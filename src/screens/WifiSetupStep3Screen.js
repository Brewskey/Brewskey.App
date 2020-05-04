// @flow

import type WifiSetupStore from '../stores/WifiSetupStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import WifiList from '../components/WifiSetup/WifiList';
import HiddenWifiInput from '../components/WifiSetup/WifiList/HiddenWifiInput';
import { observer } from 'mobx-react';

type InjectedProps = {
  wifiSetupStore: WifiSetupStore,
};

@flatNavigationParamsAndScreenProps
@observer
class WifiSetupStep3Screen extends InjectedComponent<InjectedProps> {
  render(): React.Node {
    const { wifiSetupStore } = this.injectedProps;
    return (
      <WifiList
        ListHeaderComponent={
          <HiddenWifiInput
            onConnectPress={wifiSetupStore.setupWifi}
            wifiSetupLoader={wifiSetupStore.wifiSetupLoader}
          />
        }
        onConnectPress={wifiSetupStore.setupWifi}
        wifiSetupLoader={wifiSetupStore.wifiSetupLoader}
      />
    );
  }
}

export default WifiSetupStep3Screen;
