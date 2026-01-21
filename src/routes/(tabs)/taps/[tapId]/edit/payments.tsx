import type {
  EntityID,
  Location,
  LocationMutator,
  PriceVariant,
  PriceVariantMutator,
} from '@brewskey/js-api';

import * as React from 'react';
import { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useFormContext } from 'react-hook-form';
import { FormValidationMessage } from '../../../../../common/form/FormValidationMessage';
import { handleSubmitWithError } from '../../../../../common/form/handleSubmitWithError';
import nullthrows from 'nullthrows';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { createFilter } from '@brewskey/js-api/dist/filters';
import ErrorScreen from '../../../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../../../common/ErrorBoundary';
import Container from '../../../../../common/Container';
import Section from '../../../../../common/Section';
import SectionHeader from '../../../../../common/SectionHeader';
import Button from '../../../../../common/buttons/Button';
import LoadingIndicator from '../../../../../common/LoadingIndicator';
import NotFoundScreen from '../../../../../common/NotFoundScreen';
import { FormField } from '../../../../../common/form/FormField';
import { useAddSnackBarMessage } from '../../../../../hooks/context/SnackBarContext';
import { MainTabBarFill } from '../../../../../components/MainTabBar/MainTabBarSlot';
import { SimplePicker } from '../../../../../components/pickers';
import { TextInput } from '../../../../../common/form/TextInput';
import { useGetTapById } from '../../../../../hooks/queries/TapQueries';
import { useGetLocationById, useUpdateLocation } from '../../../../../hooks/queries/LocationQueries';
import { useGetOrganizationById, useGetSquareLocations } from '../../../../../hooks/queries/OrganizationQueries';
import {
  useGetPriceVariantSingle,
  useCreatePriceVariant,
  useUpdatePriceVariant,
} from '../../../../../hooks/queries/PriceVariantQueries';
import { Form } from '../../../../../common/form/Form';

const validate = {
  ounces: (value: unknown) => {
    if (!value || !parseFloat(String(value))) {
      return 'Ounces is required';
    }
    return true;
  },
  price: (value: unknown) => {
    if (!value || !parseFloat(String(value))) {
      return 'Price is required';
    }
    return true;
  },
};

const EditTapPaymentsRouteContent: React.FC = () => {
  const { tapId } = useLocalSearchParams<{ tapId: string }>();
  const tapIdValue = typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;
  
  if (!tapIdValue) {
    return (
      <NotFoundScreen
        title="Tap Not Found"
        message="The tap you're looking for could not be found."
      />
    );
  }

  const form = useFormContext<PriceVariantMutator>();
  const {
    formState: { isSubmitting, isValid, isDirty, errors },
  } = form;

  const addSnackBarMessage = useAddSnackBarMessage();

  // Fetch tap to get location and organization IDs
  const { data: tap, isLoading: tapLoading } = useGetTapById(tapIdValue as EntityID);

  // Fetch location
  const locationId = tap?.location?.id;
  const { data: location, isLoading: locationLoading } = useGetLocationById(locationId);

  // Fetch organization
  const organizationId = tap?.organization?.id;
  const { data: organization, isLoading: organizationLoading } =
    useGetOrganizationById(organizationId);

  // Fetch price variant
  const priceVariantQueryOptions = useMemo(
    () => ({
      filters: [createFilter('tap/id').equals(tapIdValue as EntityID)],
    }),
    [tapIdValue],
  );
  const { data: priceVariant, isLoading: priceVariantLoading } =
    useGetPriceVariantSingle(priceVariantQueryOptions);

  // Fetch square locations conditionally
  const { data: squareLocations = [], isLoading: squareLocationsLoading } =
    useGetSquareLocations(organizationId ?? undefined);

  // Mutations
  const createPriceVariantMutation = useCreatePriceVariant();
  const updatePriceVariantMutation = useUpdatePriceVariant();
  const updateLocationMutation = useUpdateLocation();

  const isLoading =
    tapLoading ||
    locationLoading ||
    organizationLoading ||
    priceVariantLoading ||
    squareLocationsLoading;

  const onFormSubmit = async (values: PriceVariantMutator): Promise<PriceVariantMutator> => {
    const squareLocationID = null;

    if (squareLocationID != null && location) {
      const {
        createdDate: _,
        geolocation: _1,
        isDeleted: _2,
        organization: _3,
        timeZone: _4,
        ...otherProps
      } = location;

      await updateLocationMutation.mutateAsync({
        locationId: location.id,
        mutator: {
          ...otherProps,
          organizationId: nullthrows(organization).id,
          squareLocationID,
        } as LocationMutator,
      });
    }

    if (values.id != null) {
      await updatePriceVariantMutation.mutateAsync(values);
      addSnackBarMessage({ content: 'The price was edited' });
    } else {
      await createPriceVariantMutation.mutateAsync(values);
      addSnackBarMessage({ content: 'The price was created' });
    }
    return values;
  };

  if (isLoading || !tap || !location || !organization) {
    return (
      <Container>
        <LoadingIndicator />
      </Container>
    );
  }

  const formValue = priceVariant;

  if (!organization.canEnablePayments) {
    return (
      <Container>
        <Section bottomPadded>
          <SectionHeader title="Payments are disabled for this organization" />
        </Section>
      </Container>
    );
  }

  const formError = errors.root?.message;

  return (
    <Container>
      <KeyboardAwareScrollView testID="tap-payments-form">
        {location.squareLocationID == null && squareLocations.length > 0 && (
          <Section bottomPadded>
            <SectionHeader title="Set Square Location" testID="section-header-square-location" />
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
          </Section>
        )}
        <Section bottomPadded>
          <SectionHeader title="Set Price and Ounces" testID="section-header-price-ounces" />
          {formValue != null && <FormField component={TextInput} initialValue={formValue.id} label="ID" name="id" />}
          <FormField component={TextInput} initialValue={tapIdValue} label="Tap ID" name="tapID" />

          <FormField
            component={TextInput}
            initialValue={(formValue != null ? formValue.ounces : 0).toFixed(1)}
            name="ounces"
            keyboardType="numeric"
            label="Ounces"
          />
          <FormField
            component={TextInput}
            initialValue={(formValue != null ? formValue.price / 100 : 0).toFixed(2)}
            name="price"
            keyboardType="numeric"
            label="Price"
            _parseOnSubmit={(price: unknown) => {
              const priceNum = typeof price === 'string' ? parseFloat(price) : typeof price === 'number' ? price : 0;
              return (priceNum * 100).toFixed(0);
            }}
          />
        </Section>
      </KeyboardAwareScrollView>
      <MainTabBarFill>
        <Button
          disabled={isSubmitting || !isValid || !isDirty}
          loading={isSubmitting}
          onPress={handleSubmitWithError(form, onFormSubmit)}
          style={{ marginVertical: 12 }}
          title={formValue == null ? 'Create Price' : 'Update Price'}
        />
      </MainTabBarFill>
    </Container>
  );
};

const EditTapPaymentsRoute: React.FC = () => {
  const { tapId } = useLocalSearchParams<{ tapId: string }>();
  const tapIdValue = typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;
  
  if (!tapIdValue) {
    return null;
  }

  const { data: priceVariant } = useGetPriceVariantSingle({
    filters: [createFilter('tap/id').equals(tapIdValue as EntityID)],
  });

  const defaultValues = useMemo<Partial<PriceVariantMutator>>(
    () => ({
      tapID: tapIdValue as EntityID,
      id: priceVariant?.id,
      ounces: priceVariant?.ounces ?? 0,
      price: priceVariant ? priceVariant.price / 100 : 0,
    }),
    [tapIdValue, priceVariant],
  );

  return (
    <Form<PriceVariantMutator> defaultValues={defaultValues} validate={validate}>
      <EditTapPaymentsRouteContent />
    </Form>
  );
};

export default withErrorBoundary(EditTapPaymentsRoute, <ErrorScreen />);
