import * as React from 'react';

import { Button } from '../common/buttons/Button';
import { Container } from '../common/Container';
import { SectionContent } from '../common/SectionContent';
import { SectionHeader } from '../common/SectionHeader';
import { FinishInstructions } from '../components/WifiSetup/FinishInstructions';

interface Props {
  onSetupFinish: () => void;
}

export const WifiSetupStep4Screen: React.FC<Props> = (props) => {
  const onContinuePress = () => {
    const { onSetupFinish } = props;
    onSetupFinish();
  };

  return (
    <Container testID="wifi-setup-step4-content">
      <SectionHeader
        testID="section-header-wifi-setup-finish"
        title="Setup Finish!"
      />
      <SectionContent paddedHorizontal paddedVertical>
        <FinishInstructions />
      </SectionContent>
      <Button
        onPress={onContinuePress}
        testID="button-wifi-setup-continue"
        title="Continue"
      />
    </Container>
  );
};
