// @flow

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import FinishInstructions from '../components/WifiSetup/FinishInstructions';

type InjectedProps = {
  onSetupFinish: () => void,
};

@flatNavigationParamsAndScreenProps
class WifiSetupStep4Screen extends InjectedComponent<InjectedProps> {
  render() {
    const { onSetupFinish } = this.injectedProps;
    return <FinishInstructions onSetupFinish={onSetupFinish} />;
  }
}

export default WifiSetupStep4Screen;
