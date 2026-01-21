import * as React from 'react';
import FinishInstructions from '../components/WifiSetup/FinishInstructions';
import Button from '../common/buttons/Button';
import Container from '../common/Container';
import SectionHeader from '../common/SectionHeader';
import SectionContent from '../common/SectionContent';

type Props = {
  onSetupFinish: () => void;
};

export const WifiSetupStep4Screen: React.FC<Props> = (props) => {
  const onContinuePress = () => {
    const { onSetupFinish } = props;
    onSetupFinish();
  };

  return (
    <Container testID="wifi-setup-step4-content">
      <SectionHeader title="Setup Finish!" testID="section-header-wifi-setup-finish" />
      <SectionContent paddedHorizontal paddedVertical>
        <FinishInstructions />
      </SectionContent>
      <Button onPress={onContinuePress} testID="button-wifi-setup-continue" title="Continue" />
    </Container>
  );
};
