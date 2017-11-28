// @flow

import type { DeviceMutator } from 'brewskey.js-api';
import type { FormProps } from '../../common/form/types';

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { form } from '../../common/form';
import StepParticleId from './StepParticleId';
import StepDeviceFields from './StepDeviceFields';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

/* eslint-disable sorting/sort-object-props */
const Stepper = StackNavigator(
  {
    stepParticleId: { screen: StepParticleId },
    stepDeviceFields: { screen: StepDeviceFields },
  },
  {
    headerMode: 'none',
    initialRoute: 'enterParticleId',
  },
);
/* eslint-enable */

export const validate = (values: DeviceMutator): { [key: string]: string } => {
  const errors = {};

  if (!values.deviceStatus) {
    errors.deviceStatus = 'Status is required!';
  }

  if (!values.deviceType) {
    errors.deviceType = 'Device type is required!';
  }

  if (!values.location) {
    errors.location = 'Location is required!';
  }

  if (!values.name) {
    errors.name = 'Name is required!';
  }

  if (!values.particleId) {
    errors.particleId = 'ParticleID is required!';
  }

  return errors;
};

type Props = {|
  onSubmit: (values: DeviceMutator) => Promise<void>,
  ...FormProps,
|};

const NewDeviceForm = (props: Props) => (
  <View styles={styles.container}>
    <Stepper screenProps={props} />
  </View>
);

export default form({ validate })(NewDeviceForm);
