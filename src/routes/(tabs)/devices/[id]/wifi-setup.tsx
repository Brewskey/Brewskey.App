import * as React from 'react';
import Container from '../../../../common/Container';
import Header from '../../../../common/Header';
import { WifiSetupStep1Screen } from '../../../../screens/WifiSetupStep1Screen';
import { WifiSetupStep2Screen } from '../../../../screens/WifiSetupStep2Screen';
import { WifiSetupStep3Screen } from '../../../../screens/WifiSetupStep3Screen';
import { WifiSetupStep4Screen } from '../../../../screens/WifiSetupStep4Screen';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  WifiSetupScreenContextProvider,
  WifiSetupSteps,
  useWifiSetupScreenContext,
} from '../../../../utils/WifiSetupScreenContext';

const WifiSetupScreenContent: React.FC<InjectedProps> = (props) => {
  const [value, setValue] = useWifiSetupScreenContext();
  const router = useRouter();
  const onFinish = (particleID: string) => {
    const { forNewDevice, onSetupFinish } = props;

    if (onSetupFinish) {
      onSetupFinish(particleID);
      return;
    }

    if (forNewDevice) {
      router.navigate({
        pathname: '/(tabs)/devices/new',
        params: {
          initialValues: JSON.stringify({ particleId: particleID }),
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
          onSetupFinish={(particleID: string) => {
            setValue({
              ...value,
              particleID,
              currentStep: WifiSetupSteps.Screen4,
            });
          }}
          onReadyClick={function (): void {
            setValue({ ...value, currentStep: WifiSetupSteps.Screen2 });
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
  }
};
type InjectedProps = {
  forNewDevice?: boolean;
  onSetupFinish?: (particleID: string) => undefined | Promise<void>;
};

const WifiSetupScreen: React.FC = () => {
  const { forNewDevice, onSetupFinish } = useLocalSearchParams<{ 
    forNewDevice?: string;
    onSetupFinish?: string;
  }>();

  return (
    <Container>
      <Header showBackButton title="WiFi Setup" />
      <WifiSetupScreenContextProvider>
        <WifiSetupScreenContent
          forNewDevice={forNewDevice === 'true'}
          onSetupFinish={onSetupFinish ? JSON.parse(onSetupFinish) : undefined}
        />
      </WifiSetupScreenContextProvider>
    </Container>
  );
};

export default WifiSetupScreen;
