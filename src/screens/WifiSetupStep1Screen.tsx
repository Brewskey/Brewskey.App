import * as React from 'react';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Button } from 'common/buttons/Button';
import { SectionContent } from 'common/SectionContent';
import { SectionHeader } from 'common/SectionHeader';
import { ParticleIDInput } from 'components/ParticleIDInput';
import { DeviceSetupInstructions } from 'components/WifiSetup/DeviceSetupInstructions';
import { useClearAllQueryCaches } from 'hooks/queries/SoftApQueries';

interface Props {
  isForNewDevice?: boolean;
  onSetupFinish: (particleID: string) => void;
  onReadyClick: () => void;
}

export const WifiSetupStep1Screen: React.FC<Props> = ({
  isForNewDevice,
  onSetupFinish,
  onReadyClick,
}) => {
  // Initial purge so multiple setups have zero data
  useClearAllQueryCaches();

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      testID="wifi-setup-step1-content"
    >
      <SectionHeader
        testID="section-header-wifi-setup-instructions"
        title="Time to set up WiFi on your Brewskey box!"
      />
      <SectionContent paddedHorizontal paddedVertical>
        <DeviceSetupInstructions />
      </SectionContent>
      <Button
        onPress={onReadyClick}
        testID="button-wifi-setup-ready"
        title="Ready"
      />
      {isForNewDevice ? (
        <SectionContent paddedHorizontal paddedVertical>
          <ParticleIDInput onContinuePress={onSetupFinish} />
        </SectionContent>
      ) : null}
    </KeyboardAwareScrollView>
  );
};
