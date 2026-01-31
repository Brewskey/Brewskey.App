import * as React from 'react';

import { useForm } from 'react-hook-form';

import { Form } from 'common/form/Form';
import { HiddenWifiInput } from 'components/WifiSetup/WifiList/HiddenWifiInput';
import { WifiList } from 'components/WifiSetup/WifiList/WifiList';
import { useSetupWifi } from 'hooks/queries/SoftApQueries';
import {
  useWifiSetupScreenContext,
  WifiSetupSteps,
} from 'utils/WifiSetupScreenContext';

import type { WifiNetwork } from 'types';

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
        isSettingUpWifi={false}
        ListHeaderComponent={<HiddenWifiInput onConnectPress={setupWifi} />}
        onConnectPress={setupWifi}
      />
    </Form>
  );
};
