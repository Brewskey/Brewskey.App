// @flow

import type { Device, DeviceMutator } from 'brewskey.js-api';
import type { FormProps } from '../common/form/types';

import * as React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from 'react-native-elements';
import DeviceBaseFormFields from './DeviceBaseFormFields';
import { form, FormField } from '../common/form';
import { validate } from './NewDeviceForm';

type Props = {|
  device: Device,
  onSubmit: (values: DeviceMutator) => void,
  ...FormProps,
|};

const EditDeviceForm = ({
  device,
  handleSubmit,
  invalid,
  pristine,
  submitting,
}: Props) => (
  <KeyboardAwareScrollView>
    <DeviceBaseFormFields device={device} />
    <FormField initialValue={device.particleId} name="particleId" />
    <Button
      disabled={invalid || pristine || submitting}
      onPress={handleSubmit}
      title="Edit Brewskey box"
    />
  </KeyboardAwareScrollView>
);

export default form({ validate })(EditDeviceForm);
