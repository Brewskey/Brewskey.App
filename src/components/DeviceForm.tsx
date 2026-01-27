import * as React from 'react';

import { useForm, useWatch } from 'react-hook-form';
import { View } from 'react-native';

import { BrightnessSliderField } from './DeviceForm/BrightnessSliderField';
import { DeviceNFCStatusPicker } from './DeviceForm/DeviceNFCStatusPicker';
import { DeviceTimeOpenPicker } from './DeviceForm/DeviceTimeOpenPicker';
import { MainTabBarFill } from './MainTabBar/MainTabBarSlot';
import { LocationPicker } from './pickers/LocationPicker';
import { Button } from '../common/buttons/Button';
import { CheckBoxField } from '../common/form/CheckBoxField';
import { DropdownInput } from '../common/form/DropdownInput';
import { Form } from '../common/form/Form';
import { FormField } from '../common/form/FormField';
import { FormValidationMessage } from '../common/form/FormValidationMessage';
import { handleSubmitWithError } from '../common/form/handleSubmitWithError';
import { TextInput } from '../common/form/TextInput';
import { DESCRIPTION_BY_DEVICE_STATE } from '../constants';
import { extractShortenedEntityId } from '../utils';

import type { Device, DeviceMutator, ShortenedEntity } from '@brewskey/js-api';

export const validate = (
  values: FormProps,
): Partial<Record<keyof FormProps, string>> => {
  const errors: Record<string, string> = {};

  if (!values.deviceStatus) {
    errors.deviceStatus = 'Status is required!';
  }

  if (!values.location) {
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

interface Props {
  device: Partial<Device>;
  hideLocation?: boolean;
  onSubmit: (values: DeviceMutator) => Promise<void>;
  submitButtonLabel: string;
}

type FormProps = Omit<DeviceMutator, 'locationId'> & {
  location: ShortenedEntity | null | undefined;
};

const DeviceForm: React.FC<Props> = ({
  device,
  hideLocation,
  submitButtonLabel,
  onSubmit,
}) => {
  const form = useForm<FormProps>({
    defaultValues: {
      id: device.id,
      particleId: device.particleId,
      name: device.name,
      deviceType: 'BrewskeyBox',
      location: device.location,
      deviceStatus: device.id ? device.deviceStatus : 'Active',
      secondsToStayOpen: device.secondsToStayOpen || 3600,
      timeForValveOpen: device.timeForValveOpen,
      ledBrightness: device.ledBrightness ?? 255,
      nfcStatus: device.nfcStatus,
      isScreenDisabled: device.isScreenDisabled,
      isTotpDisabled: device.isTotpDisabled,
      shouldInvertScreen: device.shouldInvertScreen,
    },
  });

  const {
    formState: { isDirty, isSubmitting, isValid },
  } = form;

  const values = useWatch({ control: form.control });
  const { deviceStatus } = values;

  const validateForm = (formValues: FormProps): boolean => {
    const errors = validate(formValues);
    Object.keys(errors).forEach((key) => {
      const errorKey = key as keyof FormProps;
      const errorMessage = errors[errorKey];
      if (errorMessage) {
        form.setError(errorKey, {
          type: 'manual',
          message: errorMessage,
        });
      }
    });
    return Object.keys(errors).length === 0;
  };

  const onSubmitForm = async (formValues: FormProps) => {
    if (validateForm(formValues)) {
      await onSubmit({
        ...formValues,
        locationId: extractShortenedEntityId(formValues.location),
      });
    }
  };

  const deviceStatusValue = form.getValues('deviceStatus');

  return (
    <Form form={form}>
      <View>
        <FormValidationMessage testID="device-form-error-message" />
        <FormField
          component={TextInput}
          defaultValue={device.name}
          label="Name"
          name="name"
          testID="input-name"
        />
        {!device.id && (
          <FormField
            component={TextInput}
            defaultValue={device.particleId}
            label="Particle ID"
            name="particleId"
            testID="input-particleId"
          />
        )}
        {!hideLocation && (
          <FormField
            component={LocationPicker}
            defaultValue={device.location}
            label="Location"
            name="location"
          />
        )}
        {device.id ? (
          <FormField
            component={DropdownInput}
            defaultValue={device.deviceStatus}
            label="Device Status"
            labelField="label"
            name="deviceStatus"
            valueField="value"
            data={[
              { label: 'Active', value: 'Active' },
              { label: 'Cleaning', value: 'Cleaning' },
              { label: 'Unlocked', value: 'Unlocked' },
              { label: 'Inactive', value: 'Inactive' },
            ]}
            description={
              deviceStatusValue
                ? DESCRIPTION_BY_DEVICE_STATE[
                    deviceStatusValue as keyof typeof DESCRIPTION_BY_DEVICE_STATE
                  ]
                : undefined
            }
          />
        ) : null}
        {['Active', 'Inactive'].includes(deviceStatus || '') ? (
          <FormField
            component={TextInput}
            label="Seconds To Stay Open"
            name="secondsToStayOpen"
            testID="input-secondsToStayOpen"
          />
        ) : (
          <DeviceTimeOpenPicker
            defaultValue={device.secondsToStayOpen}
            name="secondsToStayOpen"
          />
        )}
        <FormField
          component={TextInput}
          defaultValue={device.timeForValveOpen?.toString()}
          description="Time in seconds before and after a pour that the pour remains authorized and the LEDs are green."
          keyboardType="number-pad"
          label="Pour Time Buffer"
          name="timeForValveOpen"
          testID="input-timeForValveOpen"
        />
        <FormField
          component={BrightnessSliderField}
          label="LED Brightness"
          name="ledBrightness"
          testID="input-ledBrightness"
        />
        <DeviceNFCStatusPicker name="nfcStatus" />
        <FormField
          component={CheckBoxField}
          defaultValue={device.isScreenDisabled}
          label="Is Screen Disabled"
          name="isScreenDisabled"
          testID="input-isScreenDisabled"
        />
        {values.isScreenDisabled ? (
          <React.Fragment>
            <FormField
              component={CheckBoxField}
              defaultValue={device.isTotpDisabled}
              label="Is Passcode Disabled"
              name="isTotpDisabled"
              testID="input-isTotpDisabled"
            />
            <FormField
              component={CheckBoxField}
              defaultValue={device.shouldInvertScreen}
              label="Invert Screen"
              name="shouldInvertScreen"
              testID="input-shouldInvertScreen"
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <FormField
              component={CheckBoxField}
              defaultValue={device.isTotpDisabled}
              description="Disable the passcode shown on the Brewskey box"
              label="Is Passcode Disabled"
              name="isTotpDisabled"
              testID="input-isTotpDisabled"
            />
            <FormField
              component={CheckBoxField}
              defaultValue={device.shouldInvertScreen}
              label="Invert Screen"
              name="shouldInvertScreen"
              testID="input-shouldInvertScreen"
            />
          </React.Fragment>
        )}
        <MainTabBarFill>
          <Button
            disabled={!isValid || !isDirty || isSubmitting}
            loading={isSubmitting}
            style={{ marginVertical: 12 }}
            title={submitButtonLabel}
            onPress={handleSubmitWithError(form, async (formData) =>
              onSubmitForm({
                ...formData,
                timeForValveOpen: Math.max(
                  Number(formData.timeForValveOpen ?? '0') || 0,
                  5,
                ),
              }),
            )}
            testID={
              device.id
                ? 'submit-button-edit-device'
                : 'submit-button-create-device'
            }
          />
        </MainTabBarFill>
      </View>
    </Form>
  );
};

export { DeviceForm };
