// @flow

import * as React from 'react';
import styled from 'styled-components/native';
import { StackNavigator } from 'react-navigation';
import { form } from '../../common/form';
import StepParticleId from './StepParticleId';
import StepDeviceFields from './StepDeviceFields';

const Container = styled.View`
  flex: 1;
`;

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

const NewDeviceForm = (props: Props): React.Node => (
  <Container>
    <Stepper screenProps={props} />
  </Container>
);

export default form({ validate })(NewDeviceForm);
