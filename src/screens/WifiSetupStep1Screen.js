// @flow

import type WifiSetupStore from '../stores/WifiSetupStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Button from '../common/buttons/Button';
import Container from '../common/Container';
import SectionHeader from '../common/SectionHeader';
import SectionContent from '../common/SectionContent';
import DeviceSetupInstructions from '../components/WifiSetup/DeviceSetupInstructions';

type InjectedProps = {
  wifiSetupStore: WifiSetupStore,
};

@flatNavigationParamsAndScreenProps
class WifiSetupStep1Screen extends InjectedComponent<InjectedProps> {
  render() {
    const { wifiSetupStore } = this.injectedProps;
    return (
      <Container>
        <SectionHeader title="Time to set up WiFi your Brewskey box!" />
        <SectionContent paddedHorizontal paddedVertical>
          <DeviceSetupInstructions />
        </SectionContent>
        <Button onPress={wifiSetupStore.onStep1Ready} title="Ready" />
      </Container>
    );
  }
}

export default WifiSetupStep1Screen;
