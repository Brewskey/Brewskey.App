import * as React from 'react';
import PhoneConnectInstructions from '../components/WifiSetup/PhoneConnectInstructions';
import Container from '../common/Container';
import SectionHeader from '../common/SectionHeader';
import SectionContent from '../common/SectionContent';
import LoadingIndicator from '../common/LoadingIndicator';
import {
  useGetParticleId,
  useGetWifiNetworks,
} from '../hooks/queries/SoftApQueries';
import {
  WifiSetupSteps,
  useWifiSetupScreenContext,
} from '../utils/WifiSetupScreenContext';
import { useEffect } from 'react';

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
    <Container>
      <SectionHeader title="Connect to Brewskey box WiFi" />
      <SectionContent paddedHorizontal paddedVertical>
        <PhoneConnectInstructions />
      </SectionContent>
      {particleID == null ? <LoadingIndicator /> : null}
    </Container>
  );
};
