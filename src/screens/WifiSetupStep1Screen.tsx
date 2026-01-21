import * as React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Button from '../common/buttons/Button';
import SectionHeader from '../common/SectionHeader';
import SectionContent from '../common/SectionContent';
import DeviceSetupInstructions from '../components/WifiSetup/DeviceSetupInstructions';
import ParticleIDInput from '../components/ParticleIDInput';
import { useClearAllQueryCaches } from '../hooks/queries/SoftApQueries';

type Props = {
  isForNewDevice?: boolean;
  onSetupFinish: (particleID: string) => void;
  onReadyClick: () => void;
};

export const WifiSetupStep1Screen: React.FC<Props> = ({
  isForNewDevice,
  onSetupFinish,
  onReadyClick,
}) => {
  // Initial purge so multiple setups have zero data
  useClearAllQueryCaches();

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" testID="wifi-setup-step1-content">
      <SectionHeader title="Time to set up WiFi on your Brewskey box!" testID="section-header-wifi-setup-instructions" />
      <SectionContent paddedHorizontal paddedVertical>
        <DeviceSetupInstructions />
      </SectionContent>
      <Button onPress={onReadyClick} testID="button-wifi-setup-ready" title="Ready" />
      {isForNewDevice && (
        <SectionContent paddedHorizontal paddedVertical>
          <ParticleIDInput onContinuePress={onSetupFinish} />
        </SectionContent>
      )}
    </KeyboardAwareScrollView>
  );
};
