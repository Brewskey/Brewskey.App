import * as React from 'react';

import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Form } from 'common/form/Form';
import { FormField } from 'common/form/FormField';
import { FormValidationMessage } from 'common/form/FormValidationMessage';
import { SubmitButton } from 'common/form/SubmitButton';
import { TextInput } from 'common/form/TextInput';
import { useHideMainTabBar } from 'components/MainTabBar/MainTabBarSlot';
import { LocationTypePicker } from 'components/pickers/LocationTypePicker';
import { OrganizationPicker } from 'components/pickers/OrganizationPicker';
import { SquareLocationPicker } from 'components/pickers/SquareLocationPicker';
import { StatePicker } from 'components/pickers/StatePicker';
import {
  useGetOrganizationById,
  useGetOrganizations,
  useGetSquareLocations,
} from 'hooks/queries/OrganizationQueries';

import type { Location, LocationMutator } from '@brewskey/js-api';

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

const validateForm = (values: FormProps): Record<string, string> => {
  const errors: Partial<Record<keyof FormProps, string>> = {};

  REQUIRED_FIELDS.forEach((fieldName: string) => {
    const value = values[fieldName as keyof FormProps];
    if (!value) {
      errors[fieldName as keyof FormProps] = isRequiredMessage(fieldName);
    }
  });

  return errors;
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
  },
});

interface Props {
  location?: Location;
  onSubmit: (values: LocationMutator) => undefined | Promise<unknown>;
  submitButtonLabel: string;
}

type FormProps = LocationMutator;

const LocationForm: React.FC<Props> = ({
  location = {
    squareLocationID: '',
  } as Location,
  submitButtonLabel,
  onSubmit,
}) => {
  useHideMainTabBar();
  const form = useForm<FormProps>({
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
    formState: { isSubmitting },
    getValues,
  } = form;

  const organizationId = getValues('organizationId');

  const { data: organization } = useGetOrganizationById(organizationId);

  // Get square locations if organization supports payments
  const { data: squareLocations } = useGetSquareLocations(organizationId);

  // Only show the organizationField if the user can fetch more than one organization
  const { data: organizationsPages } = useGetOrganizations();
  const organizations = organizationsPages?.pages?.flat() ?? [];

  const organizationField =
    organizations.length > 1 ? (
      <FormField<FormProps, typeof OrganizationPicker>
        component={OrganizationPicker}
        defaultValue={location.organization}
        label="Organization"
        name="organizationId"
        testID="organization-dropdown"
      />
    ) : null;

  const onSubmitForm = async (formValues: FormProps) => {
    const errors = validateForm(formValues);
    if (Object.keys(errors).length === 0) {
      await onSubmit(formValues);
    } else {
      // Set form errors for react-hook-form
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
    }
  };

  return (
    <Form form={form}>
      <View style={styles.container} testID="location-form">
        <FormValidationMessage testID="location-form-error-message" />
        {organizationField}
        <FormField<FormProps, typeof TextInput>
          component={TextInput}
          defaultValue={location.name}
          disabled={isSubmitting}
          label="Name"
          name="name"
          nextFocusTo="description"
          required
          testID="input-name"
        />
        <FormField<FormProps, typeof TextInput>
          component={TextInput}
          defaultValue={location.description ?? undefined}
          disabled={isSubmitting}
          label="Description"
          name="description"
          testID="input-description"
        />
        <LocationTypePicker
          defaultValue={location.locationType ?? undefined}
          disabled={isSubmitting}
          name="locationType"
          required
          testID="location-type-dropdown"
        />
        <FormField<FormProps, typeof TextInput>
          component={TextInput}
          defaultValue={location.street}
          disabled={isSubmitting}
          label="Street"
          name="street"
          nextFocusTo="suite"
          required
          testID="input-street"
        />
        <FormField<FormProps, typeof TextInput>
          component={TextInput}
          defaultValue={location.suite}
          disabled={isSubmitting}
          label="Apt./Suite"
          name="suite"
          nextFocusTo="city"
          testID="input-suite"
        />
        <FormField<FormProps, typeof TextInput>
          component={TextInput}
          defaultValue={location.city}
          disabled={isSubmitting}
          label="City"
          name="city"
          required
          testID="input-city"
        />
        <StatePicker
          defaultValue={location.state ?? undefined}
          disabled={isSubmitting}
          name="state"
          required
          testID="state-dropdown"
        />
        <FormField<FormProps, typeof TextInput>
          component={TextInput}
          defaultValue={location.zipCode?.toString()}
          disabled={isSubmitting}
          keyboardType="numeric"
          label="Zip"
          name="zipCode"
          required
          testID="input-zipCode"
        />
        {!organization?.canEnablePayments ||
        !squareLocations ||
        squareLocations.length === 0 ? null : (
          <SquareLocationPicker
            defaultValue={location.squareLocationID}
            disabled={isSubmitting}
            name="squareLocationID"
            squareLocations={squareLocations}
          />
        )}
        <SubmitButton<FormProps>
          allowSubmitWhenValid={!location?.id}
          onSubmit={onSubmitForm}
          style={{ marginVertical: 12 }}
          title={submitButtonLabel}
          testID={
            location?.id
              ? 'submit-button-edit-location'
              : 'submit-button-create-location'
          }
        />
      </View>
    </Form>
  );
};

export { LocationForm };
