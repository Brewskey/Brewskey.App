// @flow

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import flatNavigationParamsAndScreenProps from '../common/flatNavigationParamsAndScreenProps';
import FinishInstructions from '../components/WifiSetup/FinishInstructions';
import Button from '../common/buttons/Button';
import Container from '../common/Container';
import SectionHeader from '../common/SectionHeader';
import SectionContent from '../common/SectionContent';

type InjectedProps = {
  onSetupFinish: () => void,
};

@flatNavigationParamsAndScreenProps
class WifiSetupStep4Screen extends InjectedComponent<InjectedProps> {
  render() {
    const { onSetupFinish } = this.injectedProps;
    return (
      <Container>
        <SectionHeader title="Setup Finish!" />
        <SectionContent paddedHorizontal paddedVertical>
          <FinishInstructions onSetupFinish={onSetupFinish} />
        </SectionContent>
        <Button onPress={onSetupFinish} title="Continue" />
      </Container>
    );
  }
}

export default WifiSetupStep4Screen;
