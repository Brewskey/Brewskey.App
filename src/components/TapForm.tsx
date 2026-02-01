import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { CheckBoxInput } from 'common/form/CheckBoxInput';
import { DropdownInput } from 'common/form/DropdownInput';
import { Form } from 'common/form/Form';
import { FormField } from 'common/form/FormField';
import { SubmitButton } from 'common/form/SubmitButton';
import { TextInput } from 'common/form/TextInput';
import { LoadingIndicator } from 'common/LoadingIndicator';
import { SectionContent } from 'common/SectionContent';
import { DeviceOnlineIndicator } from 'components/DeviceOnlineIndicator';
import { useHideMainTabBar } from 'components/MainTabBar/MainTabBarSlot';
import { useGetDeviceById, useGetDevices } from 'hooks/queries/DeviceQueries';
import { useGetOrganizationById } from 'hooks/queries/OrganizationQueries';
import { COLORS } from 'theme';

import type {
  Device,
  EntityID,
  QueryOptions,
  Tap,
  TapMutator,
} from '@brewskey/js-api';

interface Props {
  onSubmit: (values: TapMutator) => void | Promise<void>;
  submitButtonLabel: string;
  organizationId: EntityID;
  tap?: Tap;
  device?: Device;
}

const styles = StyleSheet.create({
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 17,
    paddingHorizontal: 12,
  },
  deviceName: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 10,
  },
});

const RenderDeviceItem = (device: Device) => {
  const { data: deviceData } = useGetDeviceById(
    device.particleId == null ? device.id : undefined,
  );
  return (
    <View style={styles.deviceItem}>
      <DeviceOnlineIndicator particleID={(deviceData ?? device).particleId} />
      <Text style={styles.deviceName}>{device.name}</Text>
    </View>
  );
};

export const TapForm: React.FC<Props> = ({
  organizationId,
  tap,
  onSubmit,
  submitButtonLabel,
  device,
}) => {
  useHideMainTabBar();
  const form = useForm<TapMutator>({
    defaultValues: tap,
  });
  const {
    data: organization,
    isLoading,
    error,
  } = useGetOrganizationById(organizationId);

  // Ensure form is ready before rendering SubmitButton
  const isFormReady = !isLoading && !error && organization && form.formState;

  // Always render Form to provide context, even during loading
  return (
    <Form form={form}>
      {isLoading || error || !organization ? (
        <LoadingIndicator testID="tap-form-loading" />
      ) : (
        <View testID="tap-form">
          <FormField<TapMutator, typeof TextInput>
            component={TextInput}
            label="Description"
            name="description"
            testID="input-description"
          />
          <FormField<TapMutator, typeof DropdownInput>
            search
            component={DropdownInput}
            defaultValue={tap?.device ?? device}
            label="Device"
            labelField="name"
            name="deviceId"
            placeholder="Select Device"
            renderItem={RenderDeviceItem}
            required
            searchPlaceholder="Search device..."
            testID="device-dropdown"
            useQueryHook={useGetDevices}
            valueField="id"
            onSearchFilter={(
              keyword: string,
              baseQueryOptions: QueryOptions,
            ) => ({
              ...baseQueryOptions,
              filters: [
                ...(baseQueryOptions.filters ?? []),
                createFilter('name').contains(keyword),
              ],
            })}
          />
          {!organization?.canEnablePayments ? null : (
            <CheckBoxInput
              label="Enable Payments for this tap"
              name="isPaymentEnabled"
              testID="input-isPaymentEnabled"
            />
          )}
          <CheckBoxInput
            label="Hide leaderboard"
            name="hideLeaderboard"
            testID="input-hideLeaderboard"
          />
          <CheckBoxInput
            label="Hide Stats tab"
            name="hideStats"
            testID="input-hideStats"
          />
          <CheckBoxInput
            label="Disable Badges for tap"
            name="disableBadges"
            testID="input-disableBadges"
          />
          <SectionContent paddedVertical>
            <SubmitButton
              disabled={!isFormReady}
              onSubmit={onSubmit}
              title={submitButtonLabel}
              testID={
                tap ? 'submit-button-edit-tap' : 'submit-button-create-tap'
              }
            />
          </SectionContent>
        </View>
      )}
    </Form>
  );
};
