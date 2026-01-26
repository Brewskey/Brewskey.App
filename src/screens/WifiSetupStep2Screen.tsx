import * as React from 'react';
import { useEffect } from 'react';

import Container from '../common/Container';
import LoadingIndicator from '../common/LoadingIndicator';
import SectionContent from '../common/SectionContent';
import SectionHeader from '../common/SectionHeader';
import PhoneConnectInstructions from '../components/WifiSetup/PhoneConnectInstructions';
import {
  useGetParticleId,
  useGetWifiNetworks,
} from '../hooks/queries/SoftApQueries';
import {
  useWifiSetupScreenContext,
  WifiSetupSteps,
} from '../utils/WifiSetupScreenContext';

export const WifiSetupStep2Screen: React.FC = () => {
  const [value, setValue] = useWifiSetupScreenContext();
  const { data: particleID } = useGetParticleId();
  const { data: wifiNetworks } = useGetWifiNetworks();

  useEffect(() => {
    if (!particleID || !wifiNetworks) {
      return;
    }

    setValue({
      ...value,
      particleID,
      currentStep: WifiSetupSteps.Screen3,
    });
  }, [particleID, wifiNetworks]);

  return (
    <Container testID="wifi-setup-step2-content">
      <SectionHeader
        testID="section-header-wifi-connect"
        title="Connect to Brewskey box WiFi"
      />
      <SectionContent paddedHorizontal paddedVertical>
        <PhoneConnectInstructions />
      </SectionContent>
      {particleID == null ? <LoadingIndicator /> : null}
    </Container>
  );
};
