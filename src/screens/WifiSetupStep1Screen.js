// @flow

import type WifiSetupStore from '../stores/WifiSetupStore';

import * as React from 'react';
import { observer } from 'mobx-react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InjectedComponent from '../common/InjectedComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import Button from '../common/buttons/Button';
import SectionHeader from '../common/SectionHeader';
import SectionContent from '../common/SectionContent';
import DeviceSetupInstructions from '../components/WifiSetup/DeviceSetupInstructions';
import ParticleIDInput from '../components/ParticleIDInput';

type InjectedProps = {
  forNewDevice?: boolean,
  onSetupFinish: (particleID: string) => void,
  wifiSetupStore: WifiSetupStore,
};

@flatNavigationParamsAndScreenProps
@observer
class WifiSetupStep1Screen extends InjectedComponent<InjectedProps> {
  render(): React.Node {
    const { forNewDevice, onSetupFinish, wifiSetupStore } = this.injectedProps;
    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <SectionHeader title="Time to set up WiFi on your Brewskey box!" />
        <SectionContent paddedHorizontal paddedVertical>
          <DeviceSetupInstructions />
        </SectionContent>
        <Button onPress={wifiSetupStore.onStep1Ready} title="Ready" />
        {forNewDevice && (
          <SectionContent paddedHorizontal paddedVertical>
            <ParticleIDInput onContinuePress={onSetupFinish} />
          </SectionContent>
        )}
      </KeyboardAwareScrollView>
    );
  }
}

export default WifiSetupStep1Screen;
