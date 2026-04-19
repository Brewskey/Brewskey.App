import * as React from 'react';

import { useForm, useWatch } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DESCRIPTION_BY_DEVICE_STATE } from '@/constants';
import { CheckBoxInput } from 'common/form/CheckBoxInput';
import { DropdownInput } from 'common/form/DropdownInput';
import { Form } from 'common/form/Form';
import { FormField } from 'common/form/FormField';
import { FormValidationMessage } from 'common/form/FormValidationMessage';
import { SubmitButton } from 'common/form/SubmitButton';
import { TextInput } from 'common/form/TextInput';
import { BrightnessSliderField } from 'components/DeviceForm/BrightnessSliderField';
import { DeviceNFCStatusPicker } from 'components/DeviceForm/DeviceNFCStatusPicker';
import { DeviceTimeOpenPicker } from 'components/DeviceForm/DeviceTimeOpenPicker';
import { useHideMainTabBar } from 'components/MainTabBar/MainTabBarSlot';
import { LocationPicker } from 'components/pickers/LocationPicker';
import { COLORS } from 'theme';

import type { Device, DeviceMutator } from '@brewskey/js-api';

export const validate = (
  values: FormProps,
): Partial<Record<keyof FormProps, string>> => {
  const errors: Record<string, string> = {};

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

interface Props {
  device: Partial<Device>;
  hideLocation?: boolean;
  onSubmit: (values: DeviceMutator) => Promise<void>;
  submitButtonLabel: string;
}

type FormProps = DeviceMutator;

const styles = StyleSheet.create({
  footer: {
    backgroundColor: COLORS.secondary,
    borderTopColor: 'rgba(0, 0, 0, 0.12)',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
});

const DeviceForm: React.FC<Props> = ({
  device,
  hideLocation,
  submitButtonLabel,
  onSubmit,
}) => {
  useHideMainTabBar();
  const insets = useSafeAreaInsets();
  const form = useForm<FormProps>({
    defaultValues: {
      id: device.id,
      particleId: device.particleId ?? '',
      name: device.name,
      deviceType: 'BrewskeyBox',
      locationId: device.location?.id,
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
      await onSubmit(formValues);
    }
  };

  const deviceStatusValue = form.getValues('deviceStatus');

  return (
    <Form form={form}>
      <View style={styles.root}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          style={styles.root}
        >
          <FormValidationMessage testID="device-form-error-message" />
          <FormField<FormProps, typeof TextInput>
            component={TextInput}
            defaultValue={device.name}
            label="Name"
            name="name"
            required
            testID="input-name"
          />
          {!device.id ? (
            <FormField<FormProps, typeof TextInput>
              component={TextInput}
              defaultValue={device.particleId ?? ''}
              description="Hardware ID of your Brewskey box"
              label="Internal ID"
              name="particleId"
              required
              testID="input-particleId"
            />
          ) : null}
          {!hideLocation && (
            <FormField<FormProps, typeof LocationPicker>
              component={LocationPicker}
              defaultValue={device.location}
              label="Location"
              name="locationId"
              required
              testID="location-dropdown"
            />
          )}
          {device.id ? (
            <FormField<FormProps, typeof DropdownInput>
              component={DropdownInput}
              defaultValue={device.deviceStatus}
              label="Device Status"
              labelField="label"
              name="deviceStatus"
              required
              testID="device-status-dropdown"
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
            <FormField<FormProps, typeof TextInput>
              component={TextInput}
              label="Seconds To Stay Open"
              keyboardType="numeric"
              name="secondsToStayOpen"
              testID="input-secondsToStayOpen"
            />
          ) : (
            <DeviceTimeOpenPicker
              defaultValue={device.secondsToStayOpen}
              name="secondsToStayOpen"
              testID="time-to-stay-open-dropdown"
            />
          )}
          <FormField<FormProps, typeof TextInput>
            component={TextInput}
            description="Time in seconds before and after a pour that the pour remains authorized and the LEDs are green."
            keyboardType="numeric"
            label="Pour Time Buffer"
            name="timeForValveOpen"
            testID="input-timeForValveOpen"
          />
          <FormField<FormProps, typeof BrightnessSliderField>
            component={BrightnessSliderField}
            label="LED Brightness"
            name="ledBrightness"
            testID="input-ledBrightness"
          />
          <DeviceNFCStatusPicker
            name="nfcStatus"
            testID="nfc-status-dropdown"
          />
          <FormField<FormProps, typeof CheckBoxInput>
            component={CheckBoxInput}
            defaultValue={device.isScreenDisabled}
            label="Is Screen Disabled"
            name="isScreenDisabled"
            testID="input-isScreenDisabled"
          />
          {values.isScreenDisabled ? (
            <React.Fragment>
              <FormField<FormProps, typeof CheckBoxInput>
                component={CheckBoxInput}
                defaultValue={device.isTotpDisabled}
                label="Is Passcode Disabled"
                name="isTotpDisabled"
                testID="input-isTotpDisabled"
              />
              <FormField<FormProps, typeof CheckBoxInput>
                component={CheckBoxInput}
                defaultValue={device.shouldInvertScreen}
                label="Invert Screen"
                name="shouldInvertScreen"
                testID="input-shouldInvertScreen"
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <FormField<FormProps, typeof CheckBoxInput>
                component={CheckBoxInput}
                defaultValue={device.isTotpDisabled}
                description="Disable the passcode shown on the Brewskey box"
                label="Is Passcode Disabled"
                name="isTotpDisabled"
                testID="input-isTotpDisabled"
              />
              <FormField<FormProps, typeof CheckBoxInput>
                component={CheckBoxInput}
                defaultValue={device.shouldInvertScreen}
                label="Invert Screen"
                name="shouldInvertScreen"
                testID="input-shouldInvertScreen"
              />
            </React.Fragment>
          )}
        </ScrollView>
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <SubmitButton<FormProps>
            allowSubmitWhenValid={!device.id}
            onSubmit={onSubmitForm}
            title={submitButtonLabel}
            testID={
              device.id
                ? 'submit-button-edit-device'
                : 'submit-button-create-device'
            }
          />
        </View>
      </View>
    </Form>
  );
};

export { DeviceForm };
