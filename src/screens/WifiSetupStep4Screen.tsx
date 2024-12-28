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
    <Container>
      <SectionHeader title="Setup Finish!" />
      <SectionContent paddedHorizontal paddedVertical>
        <FinishInstructions />
      </SectionContent>
      <Button onPress={onContinuePress} title="Continue" />
    </Container>
  );
};
