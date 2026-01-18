import type {
  EntityID,
  Location,
  LocationMutator,
  Organization,
  PriceVariant,
  PriceVariantMutator,
} from '@brewskey/js-api';

import * as React from 'react';
import { useMemo } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useFormContext } from 'react-hook-form';
import { FormValidationText } from '../common/form/FormValidationMessage';
import nullthrows from 'nullthrows';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { LocationDAO } from '@brewskey/js-api';
import { createFilter } from '@brewskey/js-api/dist/filters';
import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import Container from '../common/Container';
import Section from '../common/Section';
import SectionHeader from '../common/SectionHeader';
import Button from '../common/buttons/Button';
import LoadingIndicator from '../common/LoadingIndicator';
import { FormField } from '../common/form/FormField';
import { useAddSnackBarMessage } from '../hooks/context/SnackBarContext';
import { MainTabBarFill } from '../components/MainTabBar/MainTabBarSlot';
import { SimplePicker } from '../components/pickers/SimplePicker';
import { TextInput } from '../common/form/TextInput';
import { useGetTapById } from '../hooks/queries/TapQueries';
import { useGetLocationById, useUpdateLocation } from '../hooks/queries/LocationQueries';
import { useGetOrganizationById, useGetSquareLocations } from '../hooks/queries/OrganizationQueries';
import {
  useGetPriceVariantSingle,
  useCreatePriceVariant,
  useUpdatePriceVariant,
} from '../hooks/queries/PriceVariantQueries';
import { Form } from '../common/form/Form';

// Type that works with both StaticScreenProps and MaterialTopTabScreenProps
// We only use route.params.tapId, so this minimal type works for both navigation types
// Making route optional to satisfy ScreenComponentType which can accept ComponentType<{}>
type Props = {
  route?: {
    params: { tapId: EntityID };
  } & Record<string, unknown>;
  navigation?: unknown;
};

const validate = (
  values: PriceVariantMutator,
): {
  [key: string]: string;
} => {
  const errors: Record<string, any> = {};

  if (!values.ounces || !parseFloat(String(values.ounces))) {
    errors.ounces = 'Ounces is required';
  }

  if (!values.price || !parseFloat(String(values.price))) {
    errors.price = 'Price is required';
  }

  return errors;
};

const EditTapPaymentsScreenContent: React.FC<Props> = (props: Props) => {
  const tapId = props.route?.params?.tapId;
  if (!tapId) {
    return null;
  }
  const isFocused = useIsFocused();
  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useFormContext<PriceVariantMutator>();

  const addSnackBarMessage = useAddSnackBarMessage();

  // Fetch tap to get location and organization IDs
  const { data: tap, isLoading: tapLoading } = useGetTapById(tapId);

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
      filters: [createFilter('tap/id').equals(tapId)],
    }),
    [tapId],
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
      <KeyboardAwareScrollView>
        {location.squareLocationID == null && squareLocations.length > 0 && (
          <Section bottomPadded>
            <SectionHeader title="Set Square Location" />
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
          <SectionHeader title="Set Price and Ounces" />
          {formValue != null && <FormField component={TextInput} initialValue={formValue.id} label="ID" name="id" />}
          <FormField component={TextInput} initialValue={tapId} label="Tap ID" name="tapID" />

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
      {isFocused && (
        <MainTabBarFill>
          {formError && <FormValidationText>{formError}</FormValidationText>}
          <Button
            disabled={isSubmitting || !isValid || !isDirty}
            loading={isSubmitting}
            onPress={handleSubmit(onFormSubmit)}
            style={{ marginVertical: 12 }}
            title={formValue == null ? 'Create Price' : 'Update Price'}
          />
        </MainTabBarFill>
      )}
    </Container>
  );
};

const EditTapPaymentsScreen: React.FC<Props> = (props) => {
  const tapId = props.route?.params?.tapId;
  if (!tapId) {
    return null;
  }

  const { data: priceVariant } = useGetPriceVariantSingle({
    filters: [createFilter('tap/id').equals(tapId)],
  });

  const defaultValues = useMemo<Partial<PriceVariantMutator>>(
    () => ({
      tapID: tapId,
      id: priceVariant?.id,
      ounces: priceVariant?.ounces ?? 0,
      price: priceVariant ? priceVariant.price / 100 : 0,
    }),
    [tapId, priceVariant],
  );

  return (
    <Form<PriceVariantMutator> defaultValues={defaultValues}>
      <EditTapPaymentsScreenContent {...props} />
    </Form>
  );
};

export default withErrorBoundary(EditTapPaymentsScreen, <ErrorScreen />);
