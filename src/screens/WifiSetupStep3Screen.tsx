import * as React from 'react';
import WifiList from '../components/WifiSetup/WifiList/WifiList';
import { HiddenWifiInput } from '../components/WifiSetup/WifiList/HiddenWifiInput';
import { useSetupWifi } from '../hooks/queries/SoftApQueries';
import { WifiNetwork } from '../types';
import {
  WifiSetupSteps,
  useWifiSetupScreenContext,
} from '../utils/WifiSetupScreenContext';
import { useForm } from 'react-hook-form';
import { Form } from '../common/form/Form';

export const WifiSetupStep3Screen: React.FC = () => {
  const [value, setValue] = useWifiSetupScreenContext();
  const setupWifiMutator = useSetupWifi();
  const form = useForm();
  const setupWifi = async (wifiNetwork: WifiNetwork) => {
    await setupWifiMutator.mutateAsync(wifiNetwork);
    setValue({
      ...value,
      currentStep: WifiSetupSteps.Screen4,
    });
  };
  return (
    <Form form={form}>
      <WifiList
        ListHeaderComponent={<HiddenWifiInput onConnectPress={setupWifi} />}
        onConnectPress={setupWifi}
        isSettingUpWifi={false}
      />
    </Form>
  );
};
