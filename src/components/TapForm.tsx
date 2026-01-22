import type { Device, EntityID, Tap, TapMutator } from '@brewskey/js-api';

import * as React from 'react';
import { View } from 'react-native';

import { useGetOrganizationById } from '../hooks/queries/OrganizationQueries';
import {
  useGetDeviceById,
  useGetDevices,
} from '../hooks/queries/DeviceQueries';
import { useForm } from 'react-hook-form';
import { SubmitButton } from '../common/form/SubmitButton';
import { FormValidationMessage } from '../common/form/FormValidationMessage';
import SectionContent from '../common/SectionContent';
import { Form } from '../common/form/Form';
import { CheckBoxInput } from '../common/form/CheckBoxInput';
import { DropdownInput } from '../common/form/DropdownInput';
import { createFilter } from '@brewskey/js-api/dist/filters';
import { TextInput } from '../common/form/TextInput';
import { FormField } from '../common/form/FormField';
import { MainTabBarFill } from '../components/MainTabBar/MainTabBarSlot';
import LoadingIndicator from '../common/LoadingIndicator';

type Props = {
  onSubmit: (values: TapMutator) => void | Promise<void>;
  submitButtonLabel: string;
  organizationId: EntityID;
  tap?: Tap;
};

export const TapForm: React.FC<Props> = ({
  organizationId,
  tap,
  onSubmit,
  submitButtonLabel,
}) => {
  const form = useForm<TapMutator>({
    defaultValues: {
      ...tap,
      deviceId: tap?.device.id,
      locationId: tap?.location?.id,
    },
  });
  const [deviceSearchFilter, setDeviceSearch] = React.useState('');
  const { data: organization, isLoading, error } = useGetOrganizationById(organizationId);
  const { data: devices } = useGetDevices({
    filters:
      deviceSearchFilter != null && deviceSearchFilter != ''
        ? [createFilter('name').contains(deviceSearchFilter)]
        : undefined,
  });

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
            name="description"
            label="Description"
            testID="input-description"
          />
          <DropdownInput<Device>
            data={devices?.pages.flat() ?? []}
            labelField={'name'}
            valueField={'id'}
            name="deviceId"
            required="Brewskey box is required"
            search
            searchQuery={(keyword: string) => {
              setDeviceSearch(keyword);
              return true;
            }}
          />
          {organization == null || !organization.canEnablePayments ? null : (
            <CheckBoxInput
              label="Enable Payments for this tap"
              name="isPaymentEnabled"
            />
          )}
          <CheckBoxInput label="Hide leaderboard" name="hideLeaderboard" />
          <CheckBoxInput label="Hide Stats tab" name="hideStats" />
          <CheckBoxInput label="Disable Badges for tap" name="disableBadges" />
          <MainTabBarFill>
            <SectionContent paddedVertical>
              <SubmitButton
                onSubmit={onSubmit}
                testID={tap ? 'submit-button-edit-tap' : 'submit-button-create-tap'}
                title={submitButtonLabel}
                disabled={!isFormReady}
              />
            </SectionContent>
          </MainTabBarFill>
        </View>
      )}
    </Form>
  );
};
