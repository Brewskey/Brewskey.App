import * as React from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';

import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { WifiSetupStep1Screen } from 'screens/WifiSetupStep1Screen';
import { WifiSetupStep2Screen } from 'screens/WifiSetupStep2Screen';
import { WifiSetupStep3Screen } from 'screens/WifiSetupStep3Screen';
import { WifiSetupStep4Screen } from 'screens/WifiSetupStep4Screen';
import {
  useWifiSetupScreenContext,
  WifiSetupScreenContextProvider,
  WifiSetupSteps,
} from 'utils/WifiSetupScreenContext';

const WifiSetupScreenContent: React.FC<InjectedProps> = (props) => {
  const [value, setValue] = useWifiSetupScreenContext();
  const router = useRouter();
  const onFinish = (particleID: string) => {
    const { forNewDevice, returnTo } = props;

    if (returnTo === 'nux-device') {
      router.replace({
        pathname: '/(tabs)/(nux)/device',
        params: {
          particleId: particleID,
          ...(props.locationId ? { locationId: props.locationId } : {}),
        },
      });
      return;
    }

    if (forNewDevice) {
      router.navigate({
        pathname: '/(tabs)/devices/new',
        params: {
          particleId: particleID,
        },
      });
    } else {
      router.back();
    }
  };

  switch (value.currentStep) {
    case WifiSetupSteps.Screen1: {
      return (
        <WifiSetupStep1Screen
          onReadyClick={function (): void {
            setValue({ ...value, currentStep: WifiSetupSteps.Screen2 });
          }}
          onSetupFinish={(particleID: string) => {
            setValue({
              ...value,
              particleID,
              currentStep: WifiSetupSteps.Screen4,
            });
          }}
        />
      );
    }
    case WifiSetupSteps.Screen2: {
      return <WifiSetupStep2Screen />;
    }
    case WifiSetupSteps.Screen3: {
      return <WifiSetupStep3Screen />;
    }
    case WifiSetupSteps.Screen4: {
      return (
        <WifiSetupStep4Screen
          onSetupFinish={() => onFinish(value.particleID!)}
        />
      );
    }
    default: {
      return null;
    }
  }
};
interface InjectedProps {
  forNewDevice?: boolean;
  locationId?: string;
  returnTo?: string;
}

const WifiSetupScreen: React.FC = () => {
  const { forNewDevice, locationId, returnTo } = useLocalSearchParams<{
    forNewDevice?: string;
    locationId?: string;
    returnTo?: string;
  }>();

  return (
    <Container>
      <Header showBackButton title="WiFi Setup" />
      <WifiSetupScreenContextProvider>
        <WifiSetupScreenContent
          forNewDevice={forNewDevice === 'true'}
          locationId={locationId ?? undefined}
          returnTo={returnTo}
        />
      </WifiSetupScreenContextProvider>
    </Container>
  );
};

export default WifiSetupScreen;
