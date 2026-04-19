import * as React from 'react';

import { useForm, useWatch } from 'react-hook-form';
import { View } from 'react-native';

import { DropdownInput } from 'common/form/DropdownInput';
import { Form } from 'common/form/Form';
import { FormField } from 'common/form/FormField';
import { FormValidationMessage } from 'common/form/FormValidationMessage';
import { SubmitButton } from 'common/form/SubmitButton';
import { TextInput } from 'common/form/TextInput';
import { WIFI_SECURITIES } from 'SoftApService';

import type { WifiNetwork } from 'types';

interface Props {
  onSubmit: (values: WifiNetwork) => Promise<void>;
}

interface FormProps {
  ssid: string;
  security: number;
  password?: string;
}

const SECURITY_OPTIONS = Object.entries(WIFI_SECURITIES).map(
  ([name, value]): { label: string; value: number } => ({
    label: name,
    value,
  }),
);

const DEFAULT_SECURITY = SECURITY_OPTIONS[0];

const HiddenWifiForm: React.FC<Props> = ({ onSubmit }) => {
  const form = useForm<FormProps>({
    defaultValues: { security: DEFAULT_SECURITY.value },
  });
  const security = useWatch({ control: form.control, name: 'security' });

  const handleSubmit = React.useCallback(
    (formProps: FormProps) => {
      onSubmit({
        security: formProps.security,
        ssid: formProps.ssid,
        password: formProps.password,
      });
    },
    [onSubmit],
  );

  return (
    <Form form={form}>
      <View testID="hidden-wifi-form">
        <FormValidationMessage />
        <FormField<FormProps, typeof TextInput>
          component={TextInput}
          required
          label="SSID"
          name="ssid"
          testID="input-hidden-wifi-ssid"
        />
        <FormField<FormProps, typeof DropdownInput>
          component={DropdownInput}
          data={SECURITY_OPTIONS}
          defaultValue={DEFAULT_SECURITY}
          label="Security"
          labelField="label"
          name="security"
          testID="hidden-wifi-security-dropdown"
          valueField="value"
          required
        />
        {security !== WIFI_SECURITIES.OPEN && (
          <FormField<FormProps, typeof TextInput>
            component={TextInput}
            label="Password"
            name="password"
            required
            secureTextEntry
            testID="input-hidden-wifi-password"
          />
        )}
        <SubmitButton<FormProps>
          allowSubmitWhenValid
          onSubmit={handleSubmit}
          testID="button-connect-hidden-wifi"
          title="Connect"
        />
      </View>
    </Form>
  );
};

export { HiddenWifiForm };
