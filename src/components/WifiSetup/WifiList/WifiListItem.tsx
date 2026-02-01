import * as React from 'react';

import { Icon } from '@rneui/themed';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Form } from 'common/form/Form';
import { FormField } from 'common/form/FormField';
import { FormValidationMessage } from 'common/form/FormValidationMessage';
import { SubmitButton } from 'common/form/SubmitButton';
import { TextInput } from 'common/form/TextInput';
import { useSetupWifi } from 'hooks/queries/SoftApQueries';
import { WIFI_SECURITIES } from 'SoftApService';
import { COLORS, TYPOGRAPHY } from 'theme';
import {
  useWifiSetupScreenContext,
  WifiSetupSteps,
} from 'utils/WifiSetupScreenContext';

import type { WifiNetwork } from 'types';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    borderBottomColor: COLORS.secondary2,
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  iconStyle: {
    marginLeft: 'auto',
  },
  labelContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 18,
  },
  title: {
    ...TYPOGRAPHY.secondary,
  },
});

interface Props {
  error: Error | null | undefined;
  index: number;
  isExpanded: boolean;
  item: WifiNetwork;
  onPress: (rowKey: string) => void;
  rowKey: string;
}

interface FormValues {
  password: string;
}

const WifiListItem: React.FC<Props> = ({
  index,
  isExpanded,
  item,
  onPress,
  rowKey,
}) => {
  const [value, setValue] = useWifiSetupScreenContext();
  const setupWifiMutator = useSetupWifi();
  const form = useForm<FormValues>();
  const setupWifi = React.useCallback(
    async (values: FormValues) => {
      const wifiNetwork = {
        ...item,
        index,
        password: values.password,
      };
      await setupWifiMutator.mutateAsync(wifiNetwork);
      setValue({
        ...value,
        currentStep: WifiSetupSteps.Screen4,
      });
    },
    [item, index, setupWifiMutator, setValue, value],
  );

  const handlePress = React.useCallback(() => {
    onPress(rowKey);
  }, [onPress, rowKey]);

  const { ssid, security } = item;
  const isPasswordRequired = security !== WIFI_SECURITIES.OPEN;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        disabled={isExpanded}
        onPress={handlePress}
        testID={`wifi-network-item-${rowKey}`}
      >
        <View style={styles.labelContainer}>
          <Text style={styles.title}>{ssid}</Text>
          {isPasswordRequired ? (
            <Icon containerStyle={styles.iconStyle} name="lock" />
          ) : null}
        </View>
      </TouchableOpacity>
      {isExpanded ? (
        <Form form={form}>
          {isPasswordRequired ? (
            <FormField<FormValues, typeof TextInput>
              component={TextInput}
              label="Password"
              name="password"
              testID={`wifi-network-item-password-${rowKey}`}
              required
              secureTextEntry
            />
          ) : null}
          <FormValidationMessage key="wifiSetupError" />
          <SubmitButton<FormValues>
            key="connectButton"
            onSubmit={setupWifi}
            testID={`wifi-network-item-connect-${rowKey}`}
            title="Connect"
          />
        </Form>
      ) : null}
    </View>
  );
};

export { WifiListItem };
