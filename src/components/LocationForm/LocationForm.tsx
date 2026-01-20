import type {
  EntityID,
  Location,
  LocationMutator,
  Organization,
  ShortenedEntity,
} from '@brewskey/js-api';

import * as React from 'react';
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
  useGetOrganizationById,
  useGetOrganizations,
  useGetSquareLocations,
} from '../../hooks/queries/OrganizationQueries';
import { extractShortenedEntityId } from '../../utils';

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

const validateForm = (
  values: FormProps,
): {
  [key: string]: string;
} => {
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

type Props = {
  isFocused?: boolean;
  location?: Location;
  onSubmit: (values: LocationMutator) => undefined | Promise<unknown>;
  submitButtonLabel: string;
};

type FormProps = Omit<LocationMutator, 'organizationId'> & {
  organization: ShortenedEntity | null | undefined;
};

const LocationForm: React.FC<Props> = ({
  isFocused: isFocusedProp,
  location = {
    squareLocationID: '',
  } as Location,
  submitButtonLabel,
  onSubmit,
}) => {
  const isFocusedNavigation = useIsFocused();
  const isFocused = isFocusedProp ?? isFocusedNavigation;

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

  const organizationShort = getValues('organization')

  const { data: organization } = useGetOrganizationById(organizationShort?.id);

  // Get square locations if organization supports payments
  const { data: squareLocations } = useGetSquareLocations(organizationShort?.id);

  // Only show the organizationField if the user can fetch more than one organization
  const { data: organizationsPages } = useGetOrganizations();
  const organizations =
    organizationsPages?.pages?.flat() ?? [];

  const organizationField =
    organizations.length > 1 ? (
      <FormField
        component={OrganizationPicker}
        label="Organization"
        initialValue={location.organization}
        name="organization"
      />
    ) : null;


  const onSubmitForm = async (formValues: FormProps) => {
    if (validateForm(formValues)) {
      await onSubmit({
        ...formValues,
        organizationId: extractShortenedEntityId(formValues.organization),
      });
    }
  };

  return (
    <Form form={form}>
      <View style={styles.container} testID="location-form">
        {organizationField}
        <FormField
          component={TextInput}
          disabled={isSubmitting}
          initialValue={location.name}
          label="Name"
          name="name"
          nextFocusTo="description"
          testID="input-name"
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
          testID="input-street"
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
          testID="input-city"
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
          testID="input-zipCode"
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
          <FormValidationMessage testID="location-form-error-message" />
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
