// @flow


import * as React from 'react';
import { observer } from 'mobx-react';
import InjectedComponent from '../common/InjectedComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import PhoneConnectInstructions from '../components/WifiSetup/PhoneConnectInstructions';
import Container from '../common/Container';
import SectionHeader from '../common/SectionHeader';
import SectionContent from '../common/SectionContent';
import LoadingIndicator from '../common/LoadingIndicator';
import WifiSetupStore from '../stores/WifiSetupStore';

type InjectedProps = {
  wifiSetupStore: WifiSetupStore,
};

@flatNavigationParamsAndScreenProps
@observer
class WifiSetupStep2Screen extends InjectedComponent<InjectedProps> {
  render(): React.Node {
    const { wifiSetupStore } = this.injectedProps;

    return (
      <Container>
        <SectionHeader title="Connect to Brewskey box WiFi" />
        <SectionContent paddedHorizontal paddedVertical>
          <PhoneConnectInstructions />
        </SectionContent>
        {wifiSetupStore.particleID == null ? (
          <LoadingIndicator />
        ) : null}
      </Container>
    );
  }
}

export default WifiSetupStep2Screen;
