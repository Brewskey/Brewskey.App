// @flow

import type WifiSetupStore from '../stores/WifiSetupStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import PhoneConnectInstructions from '../components/WifiSetup/PhoneConnectInstructions';

type InjectedProps = {
  wifiSetupStore: WifiSetupStore,
};

@flatNavigationParamsAndScreenProps
class WifiSetupStep2Screen extends InjectedComponent<InjectedProps> {
  render() {
    return <PhoneConnectInstructions />;
  }
}

export default WifiSetupStep2Screen;
