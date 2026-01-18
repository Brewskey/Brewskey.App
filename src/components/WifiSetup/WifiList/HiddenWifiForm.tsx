import type { WifiNetwork } from '../../../types';

import * as React from 'react';
import { View } from 'react-native';
import Button from '../../../common/buttons/Button';
import { WIFI_SECURITIES } from '../../../SoftApService';
import { TextField } from '../../../common/form/TextField';
import { DropdownInput } from '../../../common/form/DropdownInput';
import { useForm, useFormContext } from 'react-hook-form';
import { Form } from '../../../common/form/Form';

type Props = {
  onSubmit: (values: WifiNetwork) => Promise<void>;
};

type FormProps = {
  ssid: string;
  security: { label: string; value: number };
  password?: string;
};

const HiddenWifiForm: React.FC<Props> = ({ onSubmit }) => {
  const form = useFormContext<FormProps>();
  const { isValid, isDirty, isSubmitting } = form.formState;
  const security = form.watch('security');

  const handleSubmit = React.useCallback((formProps: FormProps) => {
    onSubmit({
      security: formProps.security.value,
      ssid: formProps.ssid,
      password: formProps.password,
    });
  }, [onSubmit]);

  return (
    <View>
      <TextField label="SSID" name="ssid" required />
      <DropdownInput
        data={Object.entries(WIFI_SECURITIES).map(
          ([name, value]): { label: string; value: number } => ({
            label: name,
            value,
          }),
        )}
        labelField="label"
        valueField="value"
        name={'security'}
      />
      {security.value !== WIFI_SECURITIES.OPEN && (
        <TextField label="Password" name="password" secureTextEntry />
      )}
      <Button
        disabled={!isValid || !isDirty || isSubmitting}
        onPress={form.handleSubmit(handleSubmit)}
        title="Connect"
      />
    </View>
  );
};

export default HiddenWifiForm;
