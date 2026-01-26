import * as React from 'react';

import { useForm, useFormContext } from 'react-hook-form';
import { View } from 'react-native';

import Button from '../../../common/buttons/Button';
import { DropdownInput } from '../../../common/form/DropdownInput';
import { Form } from '../../../common/form/Form';
import { FormValidationMessage } from '../../../common/form/FormValidationMessage';
import { handleSubmitWithError } from '../../../common/form/handleSubmitWithError';
import { TextField } from '../../../common/form/TextField';
import { WIFI_SECURITIES } from '../../../SoftApService';

import type { WifiNetwork } from '../../../types';

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

const HiddenWifiForm: React.FC<Props> = ({ onSubmit }) => {
  const form = useFormContext<FormProps>();
  const { isValid, isDirty, isSubmitting } = form.formState;
  const security = form.watch('security');

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
    <View>
      <FormValidationMessage />
      <TextField required label="SSID" name="ssid" />
      <DropdownInput
        data={SECURITY_OPTIONS}
        defaultValue={SECURITY_OPTIONS[0]}
        labelField="label"
        name="security"
        valueField="value"
      />
      {security !== WIFI_SECURITIES.OPEN && (
        <TextField secureTextEntry label="Password" name="password" />
      )}
      <Button
        disabled={!isValid || !isDirty || isSubmitting}
        onPress={handleSubmitWithError(form, handleSubmit)}
        title="Connect"
      />
    </View>
  );
};

export default HiddenWifiForm;
