// @flow

import type WifiSetupStore from '../stores/WifiSetupStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import FinishInstructions from '../components/WifiSetup/FinishInstructions';
import Button from '../common/buttons/Button';
import Container from '../common/Container';
import SectionHeader from '../common/SectionHeader';
import SectionContent from '../common/SectionContent';

type InjectedProps = {
  wifiSetupStore: WifiSetupStore,
  onSetupFinish: (particleID: string) => void,
};

@flatNavigationParamsAndScreenProps
class WifiSetupStep4Screen extends InjectedComponent<InjectedProps> {
  _onContinuePress = () => {
    const { onSetupFinish, wifiSetupStore } = this.injectedProps;
    onSetupFinish(wifiSetupStore.particleID);
  };

  render(): React.Node {
    return (
      <Container>
        <SectionHeader title="Setup Finish!" />
        <SectionContent paddedHorizontal paddedVertical>
          <FinishInstructions />
        </SectionContent>
        <Button onPress={this._onContinuePress} title="Continue" />
      </Container>
    );
  }
}

export default WifiSetupStep4Screen;
