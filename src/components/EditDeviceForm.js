// @flow

import type { Device, DeviceMutator } from 'brewskey.js-api';
import type { FormChildProps } from '../common/form/types';

import * as React from 'react';
// todo replace with scroll view
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from 'react-native-elements';
import DeviceBaseFormFields from './DeviceBaseFormFields';
import Form from '../common/form/Form';
import FormField from '../common/form/FormField';

type Props = {|
  device: Device,
  onSubmit: (values: DeviceMutator) => Promise<void>,
|};

const EditDeviceForm = ({ device, onSubmit }: Props): React.Node => (
  <Form>
    {({ handleSubmit }: FormChildProps): React.Node => (
      <KeyboardAwareScrollView>
        <DeviceBaseFormFields device={device} />
        <FormField initialValue={device.particleId} name="particleId" />
        <Button
          title="Edit Brewskey box"
          onPress={(): Promise<void> => handleSubmit(onSubmit)}
        />
      </KeyboardAwareScrollView>
    )}
  </Form>
);

export default EditDeviceForm;
