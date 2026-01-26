import * as React from 'react';

import { useForm, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import Button from '../../common/buttons/Button';
import { Form } from '../../common/form/Form';
import { FormField } from '../../common/form/FormField';
import { FormValidationMessage } from '../../common/form/FormValidationMessage';
import { handleSubmitWithError } from '../../common/form/handleSubmitWithError';
import { TextInput } from '../../common/form/TextInput';
import {
  useGetOrganizationById,
  useGetOrganizations,
  useGetSquareLocations,
} from '../../hooks/queries/OrganizationQueries';
import { extractShortenedEntityId } from '../../utils';
import { MainTabBarFill } from '../MainTabBar/MainTabBarSlot';

import LocationTypePicker from '../pickers/LocationTypePicker';
import { OrganizationPicker } from '../pickers/OrganizationPicker';
import SquareLocationPicker from '../pickers/SquareLocationPicker';
import StatePicker from '../pickers/StatePicker';

import type {
  EntityID,
  Location,
  LocationMutator,
  Organization,
  ShortenedEntity,
} from '@brewskey/js-api';

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

type FormProps = Omit<LocationMutator, 'organizationId'> & {
  organization: ShortenedEntity | null | undefined;
};

const LocationForm: React.FC<Props> = ({
  location = {
    squareLocationID: '',
  } as Location,
  submitButtonLabel,
  onSubmit,
}) => {
  const form = useForm<FormProps>({
    defaultValues: {
      id: location.id,
      organization: location.organization,
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
    getValues,
  } = form;

  const organizationShort = getValues('organization');

  const { data: organization } = useGetOrganizationById(organizationShort?.id);

  // Get square locations if organization supports payments
  const { data: squareLocations } = useGetSquareLocations(
    organizationShort?.id,
  );

  // Only show the organizationField if the user can fetch more than one organization
  const { data: organizationsPages } = useGetOrganizations();
  const organizations = organizationsPages?.pages?.flat() ?? [];

  const organizationField =
    organizations.length > 1 ? (
      <FormField
        component={OrganizationPicker}
        defaultValue={location.organization as any}
        label="Organization"
        name="organization"
      />
    ) : null;

  const onSubmitForm = async (formValues: FormProps) => {
    const errors = validateForm(formValues);
    if (Object.keys(errors).length === 0) {
      await onSubmit({
        ...formValues,
        organizationId: extractShortenedEntityId(formValues.organization),
      });
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
        <FormField
          component={TextInput}
          defaultValue={location.name}
          disabled={isSubmitting}
          label="Name"
          name="name"
          nextFocusTo="description"
          testID="input-name"
        />
        <FormField
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
        />
        <FormField
          component={TextInput}
          defaultValue={location.street}
          disabled={isSubmitting}
          label="Street"
          name="street"
          nextFocusTo="suite"
          testID="input-street"
        />
        <FormField
          component={TextInput}
          defaultValue={location.suite}
          disabled={isSubmitting}
          label="Apt./Suite"
          name="suite"
          nextFocusTo="city"
          testID="input-suite"
        />
        <FormField
          component={TextInput}
          defaultValue={location.city}
          disabled={isSubmitting}
          label="City"
          name="city"
          testID="input-city"
        />
        <StatePicker
          defaultValue={location.state ?? undefined}
          disabled={isSubmitting}
          name="state"
        />
        <FormField
          component={TextInput}
          defaultValue={location.zipCode.toString()}
          disabled={isSubmitting}
          keyboardType="numeric"
          label="Zip"
          name="zipCode"
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
        <MainTabBarFill>
          <Button
            disabled={!isValid || !isDirty || isSubmitting}
            loading={isSubmitting}
            onPress={handleSubmitWithError(form, onSubmitForm)}
            style={{ marginVertical: 12 }}
            title={submitButtonLabel}
            testID={
              location
                ? 'submit-button-edit-location'
                : 'submit-button-create-location'
            }
          />
        </MainTabBarFill>
      </View>
    </Form>
  );
};

export default LocationForm;
