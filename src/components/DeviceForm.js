// @flow

import type {
  Device,
  DeviceMutator,
  EntityID,
  LoadObject,
  Location,
} from 'brewskey.js-api';
import type { FormProps } from '../common/form/types';

import * as React from 'react';
import { View } from 'react-native';
import InjectedComponent from '../common/InjectedComponent';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { FormValidationMessage } from 'react-native-elements';
import Button from '../common/buttons/Button';
import { LocationStore } from '../stores/DAOStores';
import { form, FormField } from '../common/form';
import TextField from './TextField';
import LocationPicker from './pickers/LocationPicker';
import DeviceStatePicker from './DeviceStatePicker';
import BrightnessSliderField from './DeviceForm/BrightnessSliderField';
import CheckBoxField from './CheckBoxField';
import DeviceTimeOpenPicker from './DeviceForm/DeviceTimeOpenPicker';
import DeviceNFCStatusPicker from './DeviceForm/DeviceNFCStatusPicker';
import { Fill } from 'react-slot-fill';

export const validate = (values: DeviceMutator): { [key: string]: string } => {
  const errors = {};

  if (!values.deviceStatus) {
    errors.deviceStatus = 'Status is required!';
  }

  if (!values.locationId) {
    errors.locationId = 'Location is required!';
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
  device: $Shape<Device>,
  hideLocation?: boolean,
  onSubmit: (values: DeviceMutator) => Promise<void>,
  submitButtonLabel: string,
|};

@form({ validate })
@observer
class DeviceForm extends InjectedComponent<FormProps, Props> {
  @computed
  get _locationsLoader(): LoadObject<Array<LoadObject<Location>>> {
    return LocationStore.getMany();
  }

  render() {
    const { device, hideLocation, submitButtonLabel } = this.props;
    const {
      formError,
      handleSubmit,
      invalid,
      pristine,
      submitting,
      values,
    } = this.injectedProps;

    return (
      <View>
        <FormField initialValue={device.id} name="id" />
        <FormField initialValue={device.particleId} name="particleId" />
        <FormField
          component={TextField}
          initialValue={device.name}
          label="name"
          name="name"
        />
        <FormField initialValue="BrewskeyBox" name="deviceType" />
        <FormField
          component={hideLocation ? null : LocationPicker}
          initialValue={device.location}
          name="locationId"
          parseOnSubmit={(value: Location): EntityID => value.id}
        />
        <FormField
          component={device.id ? DeviceStatePicker : null}
          initialValue={device.id ? device.deviceStatus : 'Active'}
          name="deviceStatus"
        />
        {['Active', 'Inactive'].includes(values.deviceStatus) ? (
          <FormField initialValue={3600} name="secondsToStayOpen" />
        ) : (
          <FormField
            component={DeviceTimeOpenPicker}
            initialValue={device.secondsToStayOpen}
            name="secondsToStayOpen"
          />
        )}
        <FormField
          component={TextField}
          description="Time in seconds before and after a pour that the pour remains authorized and the LEDs are green."
          disabled={submitting}
          initialValue={device.timeForValveOpen}
          keyboardType="number-pad"
          label="Pour Time Buffer"
          name="timeForValveOpen"
          parseOnSubmit={(value: number): number => Math.max(value, 5)}
        />
        <FormField
          component={BrightnessSliderField}
          initialValue={device.ledBrightness}
          name="ledBrightness"
          parseOnSubmit={(value: number): string => value.toFixed(0)}
        />
        <FormField
          component={DeviceNFCStatusPicker}
          initialValue={device.nfcStatus}
          name="nfcStatus"
        />
        <FormField
          component={CheckBoxField}
          disabled={submitting}
          initialValue={device.isScreenDisabled}
          label="Is Screen Disabled"
          name="isScreenDisabled"
        />
        {values.isScreenDisabled ? (
          <>
            <FormField
              initialValue={device.isTotpDisabled}
              name="isTotpDisabled"
            />
            <FormField
              initialValue={device.shouldInvertScreen}
              name="shouldInvertScreen"
            />
          </>
        ) : (
          <>
            <FormField
              component={CheckBoxField}
              description="Disable the passcode shown on the Brewskey box"
              disabled={submitting}
              initialValue={device.isTotpDisabled}
              label="Is Passcode Disabled"
              name="isTotpDisabled"
            />
            <FormField
              component={CheckBoxField}
              disabled={submitting}
              initialValue={device.shouldInvertScreen}
              label="Invert Screen"
              name="shouldInvertScreen"
            />
          </>
        )}
        <Fill name="MainTabBar">
          <FormValidationMessage>{formError}</FormValidationMessage>
          <Button
            disabled={invalid || pristine || submitting}
            loading={submitting}
            onPress={handleSubmit}
            style={{ marginVertical: 12 }}
            title={submitButtonLabel}
          />
        </Fill>
      </View>
    );
  }
}

export default DeviceForm;
