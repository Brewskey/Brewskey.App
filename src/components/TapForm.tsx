import * as React from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import nullthrows from 'nullthrows';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { CheckBoxInput } from '../common/form/CheckBoxInput';
import { Form } from '../common/form/Form';
import { FormValidationMessage } from '../common/form/FormValidationMessage';
import { SubmitButton } from '../common/form/SubmitButton';
import {
  useGetDeviceById,
  useGetDevices,
} from '../hooks/queries/DeviceQueries';
import { useGetOrganizationById } from '../hooks/queries/OrganizationQueries';
import SectionContent from '../common/SectionContent';
import { DropdownInput } from '../common/form/DropdownInput';
import { TextInput } from '../common/form/TextInput';
import { FormField } from '../common/form/FormField';
import { MainTabBarFill } from './MainTabBar/MainTabBarSlot';
import LoadingIndicator from '../common/LoadingIndicator';
import { DeviceOnlineIndicator } from './DeviceOnlineIndicator';
import { COLORS } from '../theme';

import type {
  Device,
  EntityID,
  QueryOptions,
  ShortenedEntity,
  Tap,
  TapMutator,
} from '@brewskey/js-api';

interface Props {
  onSubmit: (values: TapMutator) => void | Promise<void>;
  submitButtonLabel: string;
  organizationId: EntityID;
  tap?: Tap;
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
}) => {
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
          <FormField
            component={TextInput}
            label="Description"
            name="description"
            testID="input-description"
          />
          <FormField
            search
            component={DropdownInput}
            defaultValue={tap?.device}
            label="Device"
            labelField="name"
            name="deviceId"
            placeholder="Select Device"
            renderItem={RenderDeviceItem}
            searchPlaceholder="Search device..."
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
          <MainTabBarFill>
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
          </MainTabBarFill>
        </View>
      )}
    </Form>
  );
};
