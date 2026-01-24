import type {
  Device,
  DeviceMutator,
  EntityID,
  Location,
  ShortenedEntity,
} from '@brewskey/js-api';
import * as React from 'react';
import { View } from 'react-native';
import { useForm, useWatch } from 'react-hook-form';

import { FormValidationMessage } from '../common/form/FormValidationMessage';
import Button from '../common/buttons/Button';
import { Form } from '../common/form/Form';
import { FormField } from '../common/form/FormField';
import { TextInput } from '../common/form/TextInput';
import { LocationPicker } from './pickers';
import DeviceStatePicker from './DeviceStatePicker';
import BrightnessSliderField from './DeviceForm/BrightnessSliderField';
import { CheckBoxField } from '../common/form/CheckBoxField';
import DeviceTimeOpenPicker from './DeviceForm/DeviceTimeOpenPicker';
import DeviceNFCStatusPicker from './DeviceForm/DeviceNFCStatusPicker';
import { MainTabBarFill } from '../components/MainTabBar/MainTabBarSlot';
import { extractShortenedEntityId } from '../utils';
import { handleSubmitWithError } from '../common/form/handleSubmitWithError';

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

type Props = {
  device: Partial<Device>;
  hideLocation?: boolean;
  onSubmit: (values: DeviceMutator) => Promise<void>;
  submitButtonLabel: string;
};

type FormProps = Omit<DeviceMutator, 'locationId'> & {
  location: ShortenedEntity | null | undefined;
};

const DeviceForm: React.FC<Props> = ({ device, hideLocation, submitButtonLabel, onSubmit }) => {
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
      ledBrightness: device.ledBrightness,
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
  const deviceStatus = values.deviceStatus;

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

  return (
    <Form form={form}>
      <View>
        <FormValidationMessage testID="device-form-error-message" />
        <FormField
          component={TextInput}
          initialValue={device.name}
          label="Name"
          name="name"
          testID="input-name"
        />
        {!device.id && (
          <FormField
            component={TextInput}
            initialValue={device.particleId}
            label="Particle ID"
            name="particleId"
            testID="input-particleId"
          />
        )}
        {!hideLocation && (
          <FormField
            component={LocationPicker}
            initialValue={device.location}
            label="Location"
            name="location"
            multiple={false}
          />
        )}
        {device.id && (
          <FormField
            component={DeviceStatePicker}
            initialValue={device.deviceStatus}
            label="Device Status"
            name="deviceStatus"
          />
        )}
        {['Active', 'Inactive'].includes(deviceStatus || '') ? (
          <FormField
            component={TextInput}
            initialValue="3600"
            label="Seconds To Stay Open"
            name="secondsToStayOpen"
            testID="input-secondsToStayOpen"
          />
        ) : (
          <FormField
            component={DeviceTimeOpenPicker}
            initialValue={device.secondsToStayOpen}
            label="Seconds To Stay Open"
            name="secondsToStayOpen"
          />
        )}
        <FormField
          component={TextInput}
          description="Time in seconds before and after a pour that the pour remains authorized and the LEDs are green."
          initialValue={device.timeForValveOpen?.toString()}
          keyboardType="number-pad"
          label="Pour Time Buffer"
          name="timeForValveOpen"
          testID="input-timeForValveOpen"
          _parseOnSubmit={(value: unknown): number => Math.max(Number(value as string) || 0, 5)}
        />
        <FormField
          component={BrightnessSliderField}
          initialValue={device.ledBrightness}
          label="LED Brightness"
          name="ledBrightness"
          testID="input-ledBrightness"
          _parseOnSubmit={(value: unknown): string => (value as number).toFixed(0)}
        />
        <FormField
          component={DeviceNFCStatusPicker}
          initialValue={device.nfcStatus}
          label="NFC Status"
          name="nfcStatus"
        />
        <FormField
          component={CheckBoxField}
          initialValue={device.isScreenDisabled}
          label="Is Screen Disabled"
          name="isScreenDisabled"
          testID="input-isScreenDisabled"
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
              initialValue={device.isTotpDisabled}
              label="Is Passcode Disabled"
              name="isTotpDisabled"
              testID="input-isTotpDisabled"
            />
            <FormField
              component={CheckBoxField}
              initialValue={device.shouldInvertScreen}
              label="Invert Screen"
              name="shouldInvertScreen"
              testID="input-shouldInvertScreen"
            />
          </>
        )}
        <MainTabBarFill>
          <Button
            disabled={!isValid || !isDirty || isSubmitting}
            loading={isSubmitting}
            onPress={handleSubmitWithError(form, onSubmitForm)}
            style={{ marginVertical: 12 }}
            testID={device.id ? 'submit-button-edit-device' : 'submit-button-create-device'}
            title={submitButtonLabel}
          />
        </MainTabBarFill>
      </View>
    </Form>
  );
};

export default DeviceForm;
