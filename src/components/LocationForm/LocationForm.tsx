import type {
  EntityID,
  Location,
  LocationMutator,
  Organization,
} from '@brewskey/js-api';

import * as React from 'react';
import { useMemo } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useForm, useWatch } from 'react-hook-form';
import { MainTabBarFill } from '../MainTabBar/MainTabBarSlot';

import { StyleSheet, View } from 'react-native';
import { FormValidationMessage } from '../../common/form/FormValidationMessage';
import STATE_LIST from './stateList';
import { Form } from '../../common/form/Form';
import { FormField } from '../../common/form/FormField';
import { TextInput } from '../../common/form/TextInput';
import Button from '../../common/buttons/Button';
import { SimplePicker } from '../pickers/SimplePicker';
import OrganizationPicker from '../pickers/OrganizationPicker';
import {
  useGetOrganizations,
  useGetSquareLocations,
} from '../../hooks/queries/OrganizationQueries';

const REQUIRED_FIELDS = [
  'city',
  'locationType',
  'name',
  'state',
  'street',
  'zipCode',
];

const isRequiredMessage = (fieldName: string): string =>
  `${fieldName} is required`;

const validate = (
  values: LocationMutator,
): {
  [key: string]: string;
} => {
  const errors: Partial<Record<keyof LocationMutator, string>> = {};

  REQUIRED_FIELDS.forEach((fieldName: string) => {
    const value = values[fieldName as keyof LocationMutator];
    if (!value) {
      errors[fieldName as keyof LocationMutator] = isRequiredMessage(fieldName);
    }
  });

  return errors;
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
  },
});

type Props = {
  isFocused?: boolean;
  location?: Location;
  onSubmit: (values: LocationMutator) => undefined | Promise<unknown>;
  submitButtonLabel: string;
};

const LocationForm: React.FC<Props> = ({
  isFocused: isFocusedProp,
  location = {
    squareLocationID: '',
  },
  submitButtonLabel,
  onSubmit,
}) => {
  const isFocusedNavigation = useIsFocused();
  const isFocused = isFocusedProp ?? isFocusedNavigation;

  const form = useForm<LocationMutator>({
    defaultValues: {
      id: location.id,
      organizationId: location.organization?.id,
      name: location.name,
      description: location.description,
      locationType: location.locationType,
      street: location.street,
      suite: location.suite,
      city: location.city,
      state: location.state,
      zipCode: location.zipCode,
      squareLocationID: location.squareLocationID,
    },
  });

  const {
    handleSubmit,
    formState: { isDirty, isSubmitting, isValid },
  } = form;

  const values = useWatch({ control: form.control });
  const organizationId = values.organizationId;

  // Get organizations list
  const { data: organizationsData } = useGetOrganizations();
  const organizations = useMemo(() => {
    if (!organizationsData?.pages) return [];
    return organizationsData.pages.flatMap((page) => page);
  }, [organizationsData]);

  const organizationCount = organizations.length;

  const organization = useMemo((): Organization | null | undefined => {
    if (organizationId) {
      const orgId = typeof organizationId === 'object' && 'id' in organizationId
        ? (organizationId as Organization).id
        : (organizationId as EntityID);
      return organizations.find((org) => org.id === orgId);
    }

    return organizations[0] || null;
  }, [organizationId, organizations]);

  // Get square locations if organization supports payments
  const { data: squareLocations } = useGetSquareLocations(organization?.id);

  let organizationField = null;
  if (organizationCount === 1 && organization != null) {
    organizationField = (
      <FormField
        component={TextInput}
        label="Organization"
        name="organizationId"
        initialValue={organization.id}
      />
    );
  } else if (organizationCount > 1) {
    organizationField = (
      <FormField
        component={OrganizationPicker}
        label="Organization"
        initialValue={location.organization}
        name="organizationId"
        _parseOnSubmit={(value: unknown): EntityID => {
          const org = value as Organization;
          return org.id;
        }}
      />
    );
  }

  const onSubmitForm = async (formValues: LocationMutator) => {
    await onSubmit(formValues);
  };

  return (
    <Form form={form}>
      <View style={styles.container}>
        <FormField
          component={TextInput}
          label="ID"
          name="id"
          initialValue={location.id}
        />
        {organizationField}
        <FormField
          component={TextInput}
          disabled={isSubmitting}
          initialValue={location.name}
          label="Name"
          name="name"
          nextFocusTo="description"
        />
        <FormField
          component={TextInput}
          disabled={isSubmitting}
          initialValue={location.description}
          label="Description"
          name="description"
        />
        <FormField
          component={SimplePicker}
          doesRequireConfirmation={false}
          headerTitle="Select Location Type"
          initialValue={location.locationType}
          label="Location type"
          name="locationType"
          pickerValues={[
            { label: 'Kegerator', value: 'Kegerator' },
            { label: 'Bar', value: 'Bar' },
          ]}
        />
        <FormField
          component={TextInput}
          disabled={isSubmitting}
          initialValue={location.street}
          label="Street"
          name="street"
          nextFocusTo="suite"
        />
        <FormField
          component={TextInput}
          disabled={isSubmitting}
          initialValue={location.suite}
          label="Apt./Suite"
          name="suite"
          nextFocusTo="city"
        />
        <FormField
          component={TextInput}
          disabled={isSubmitting}
          initialValue={location.city}
          label="City"
          name="city"
        />
        <FormField
          component={SimplePicker}
          disabled={isSubmitting}
          doesRequireConfirmation={false}
          headerTitle="Select State"
          initialValue={location.state}
          label="State"
          name="state"
          pickerValues={STATE_LIST}
        />
        <FormField
          component={TextInput}
          disabled={isSubmitting}
          initialValue={location.zipCode}
          keyboardType="numeric"
          label="Zip"
          name="zipCode"
        />
        {organization == null ||
        !organization.canEnablePayments ||
        !squareLocations ||
        squareLocations.length === 0 ? null : (
          <FormField
            component={SimplePicker}
            disabled={isSubmitting}
            doesRequireConfirmation={false}
            headerTitle="Select Square Location"
            initialValue={location.squareLocationID}
            label="Square Location"
            name="squareLocationID"
            pickerValues={squareLocations.map((item) => ({
              label: item.name,
              value: item.locationID,
            }))}
          />
        )}
        <MainTabBarFill>
          <FormValidationMessage />
          <Button
            disabled={!isValid || !isDirty || isSubmitting || !isFocused}
            loading={isSubmitting}
            onPress={handleSubmit(onSubmitForm)}
            style={{ marginVertical: 12 }}
            title={submitButtonLabel}
          />
        </MainTabBarFill>
      </View>
    </Form>
  );
};

export default LocationForm;
