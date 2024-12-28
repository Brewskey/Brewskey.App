import * as React from 'react';
import Container from '../common/Container';
import Header from '../common/Header';
import { WifiSetupStep1Screen } from './WifiSetupStep1Screen';
import { WifiSetupStep2Screen } from './WifiSetupStep2Screen';
import { WifiSetupStep3Screen } from './WifiSetupStep3Screen';
import { WifiSetupStep4Screen } from './WifiSetupStep4Screen';
import { useNavigation } from '@react-navigation/native';
import {
  WifiSetupScreenContextProvider,
  WifiSetupSteps,
  useWifiSetupScreenContext,
} from '../utils/WifiSetupScreenContext';

const WifiSetupScreenContent: React.FC<InjectedProps> = (props) => {
  const [value, setValue] = useWifiSetupScreenContext();
  const navigation = useNavigation();
  const onFinish = (particleID: string) => {
    const { forNewDevice, onSetupFinish } = props;

    if (onSetupFinish) {
      onSetupFinish(particleID);
      return;
    }

    if (forNewDevice) {
      navigation.navigate('newDevice', {
        initialValues: {
          particleId: particleID,
        },
      });
    } else {
      navigation.goBack();
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

export const WifiSetupScreen: React.FC<InjectedProps> = ({
  forNewDevice,
  onSetupFinish,
}) => {
  return (
    <Container>
      <Header showBackButton title="WiFi Setup" />
      <WifiSetupScreenContextProvider>
        <WifiSetupScreenContent
          forNewDevice={forNewDevice}
          onSetupFinish={onSetupFinish}
        />
      </WifiSetupScreenContextProvider>
    </Container>
  );
};
