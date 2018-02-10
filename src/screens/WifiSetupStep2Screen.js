// @flow

import type WifiSetupStore from '../stores/WifiSetupStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import PhoneConnectInstructions from '../components/WifiSetup/PhoneConnectInstructions';
import Container from '../common/Container';
import SectionHeader from '../common/SectionHeader';
import SectionContent from '../common/SectionContent';

type InjectedProps = {
  wifiSetupStore: WifiSetupStore,
};

@flatNavigationParamsAndScreenProps
class WifiSetupStep2Screen extends InjectedComponent<InjectedProps> {
  render() {
    return (
      <Container>
        <SectionHeader title="Connect to Brewskey box WiFi" />
        <SectionContent paddedHorizontal paddedVertical>
          <PhoneConnectInstructions />
        </SectionContent>
      </Container>
    );
  }
}

export default WifiSetupStep2Screen;
