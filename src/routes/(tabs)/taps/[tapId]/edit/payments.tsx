import * as React from 'react';
import { useMemo } from 'react';

import { createFilter } from '@brewskey/js-api/dist/filters';
import { useLocalSearchParams } from 'expo-router';
import nullthrows from 'nullthrows';
import { useFormContext } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Button } from '../../../../../common/buttons/Button';
import { Container } from '../../../../../common/Container';
import { withErrorBoundary } from '../../../../../common/ErrorBoundary';
import { ErrorScreen } from '../../../../../common/ErrorScreen';
import { Form } from '../../../../../common/form/Form';
import { FormField } from '../../../../../common/form/FormField';
import { handleSubmitWithError } from '../../../../../common/form/handleSubmitWithError';
import { TextInput } from '../../../../../common/form/TextInput';
import { Header } from '../../../../../common/Header';
import { LoadingIndicator } from '../../../../../common/LoadingIndicator';
import { NotFoundScreen } from '../../../../../common/NotFoundScreen';
import { Section } from '../../../../../common/Section';
import { SectionHeader } from '../../../../../common/SectionHeader';
import { MainTabBarFill } from '../../../../../components/MainTabBar/MainTabBarSlot';
import { SquareLocationPicker } from '../../../../../components/pickers/SquareLocationPicker';
import { useAddSnackBarMessage } from '../../../../../hooks/context/SnackBarContext';
import {
  useGetLocationById,
  useUpdateLocation,
} from '../../../../../hooks/queries/LocationQueries';
import {
  useGetOrganizationById,
  useGetSquareLocations,
} from '../../../../../hooks/queries/OrganizationQueries';
import {
  useCreatePriceVariant,
  useGetPriceVariantSingle,
  useUpdatePriceVariant,
} from '../../../../../hooks/queries/PriceVariantQueries';
import { useGetTapById } from '../../../../../hooks/queries/TapQueries';

import type {
  EntityID,
  Location,
  LocationMutator,
  PriceVariant,
  PriceVariantMutator,
} from '@brewskey/js-api';

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
  const tapIdValue =
    typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;

  // All hooks must be called unconditionally before any early returns
  const form = useFormContext<PriceVariantMutator>();
  const isFormReady = form.formState != null;
  const {
    formState: { isSubmitting, isValid, isDirty, errors },
  } = form;

  const addSnackBarMessage = useAddSnackBarMessage();

  // Fetch tap to get location and organization IDs
  const { data: tap, isLoading: tapLoading } = useGetTapById(
    tapIdValue as EntityID,
  );

  // Fetch location
  const locationId = tap?.location?.id;
  const { data: location, isLoading: locationLoading } =
    useGetLocationById(locationId);

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

  const onFormSubmit = async (
    values: PriceVariantMutator,
  ): Promise<PriceVariantMutator> => {
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
        <Header shouldShowBackButton />
        <LoadingIndicator testID="tap-payments-loading" />
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
            <SectionHeader
              testID="section-header-square-location"
              title="Set Square Location"
            />
            <SquareLocationPicker
              defaultValue={location.squareLocationID ?? undefined}
              disabled={isSubmitting}
              name="squareLocationID"
              squareLocations={squareLocations}
            />
          </Section>
        )}
        <Section bottomPadded>
          <SectionHeader
            testID="section-header-price-ounces"
            title="Set Price and Ounces"
          />
          {formValue != null && (
            <FormField
              component={TextInput}
              defaultValue={formValue.id?.toString()}
              label="ID"
              name="id"
            />
          )}
          <FormField
            component={TextInput}
            defaultValue={tapIdValue?.toString()}
            label="Tap ID"
            name="tapID"
          />

          <FormField
            component={TextInput}
            defaultValue={(formValue != null ? formValue.ounces : 0).toFixed(1)}
            keyboardType="numeric"
            label="Ounces"
            name="ounces"
          />
          <FormField
            component={TextInput}
            keyboardType="numeric"
            label="Price"
            name="price"
            defaultValue={(formValue != null
              ? formValue.price / 100
              : 0
            ).toFixed(2)}
          />
        </Section>
      </KeyboardAwareScrollView>
      <MainTabBarFill>
        <Button
          disabled={!isFormReady || isSubmitting || !isValid || !isDirty}
          loading={isSubmitting}
          style={{ marginVertical: 12 }}
          title={formValue == null ? 'Create Price' : 'Update Price'}
          onPress={
            isFormReady
              ? handleSubmitWithError(
                  form,
                  async (values: PriceVariantMutator) =>
                    onFormSubmit({
                      ...values,
                      price: Number.parseInt(
                        (
                          (typeof values.price === 'string'
                            ? parseFloat(values.price)
                            : typeof values.price === 'number'
                              ? values.price
                              : 0) * 100
                        ).toFixed(0),
                        10,
                      ),
                    }),
                )
              : undefined
          }
        />
      </MainTabBarFill>
    </Container>
  );
};

const EditTapPaymentsRoute: React.FC = () => {
  const { tapId } = useLocalSearchParams<{ tapId: string }>();
  const tapIdValue =
    typeof tapId === 'string' && !isNaN(Number(tapId)) ? Number(tapId) : tapId;

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
    <Form<PriceVariantMutator>
      defaultValues={defaultValues}
      validate={validate}
    >
      <EditTapPaymentsRouteContent />
    </Form>
  );
};

export default withErrorBoundary(EditTapPaymentsRoute, <ErrorScreen />);
