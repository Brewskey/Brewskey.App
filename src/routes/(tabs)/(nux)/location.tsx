import * as React from 'react';

import { Icon } from '@rneui/themed';
import { FormProvider, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { Container } from '../../../common/Container';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import { ErrorScreen } from '../../../common/ErrorScreen';
import { SubmitButton } from '../../../common/form/SubmitButton';
import { Header } from '../../../common/Header';
import { LocationPicker } from '../../../components/pickers/LocationPicker';
import {
  useGetLocationById,
  useGetLocationsCount,
} from '../../../hooks/queries/LocationQueries';
import { COLORS, TYPOGRAPHY } from '../../../theme';

import type { EntityID } from '@brewskey/js-api';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 30,
  },
  descriptionText: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textInverse,
    paddingHorizontal: 15,
    paddingVertical: 30,
    textAlign: 'center',
  },
  iconContainer: {
    alignSelf: 'center',
  },
  input: {
    color: 'white',
  },
  label: {
    color: 'white',
  },
  validationText: {
    color: COLORS.danger2,
  },
});

interface Props {
  onContinuePress: (formData: FormData) => void;
}

interface FormData {
  locationId: EntityID;
}

const NuxLocationScreen: React.FC<Props> = ({ onContinuePress }) => {
  const { data: locationsCount } = useGetLocationsCount();

  const form = useForm<FormData>();

  // Watch the form value to get selectedLocation
  const selectedLocationId = form.watch('locationId');
  const { data: selectedLocation } = useGetLocationById(selectedLocationId);

  const hasNoLocation = locationsCount === 0;
  const hasOneLocation = locationsCount === 1;
  const hasManyLocations = locationsCount != null && locationsCount > 1;

  return (
    <Container>
      <Header shouldShowBackButton title="1. Setup location" />
      <View style={styles.container} testID="nux-location-content">
        <Icon
          color={COLORS.textInverse}
          containerStyle={styles.iconContainer}
          name="map-marker"
          size={200}
          type="material-community"
        />
        <Text style={styles.descriptionText} testID="nux-location-description">
          {hasNoLocation
            ? 'Okay, the first thing we need to do ' +
              'is to set up a location for your Brewskey box.'
            : null}
          {hasOneLocation
            ? `You've already set up the location ${
                selectedLocation && 'name' in selectedLocation
                  ? selectedLocation.name
                  : ''
              }`
            : null}
          {hasManyLocations
            ? 'You already created some locations, you need to choose one ' +
              'for further setup.'
            : null}
        </Text>
        {hasManyLocations ? (
          <FormProvider {...form}>
            <LocationPicker
              defaultValue={selectedLocation}
              name="location"
              required="Location is required"
              testID="picker-location-nux"
            />
          </FormProvider>
        ) : null}
        <SubmitButton<FormData>
          disabled={hasManyLocations ? !selectedLocation : false}
          onSubmit={onContinuePress}
          testID="button-next"
          title="Next"
        />
      </View>
    </Container>
  );
};

export default withErrorBoundary(
  NuxLocationScreen as unknown as React.ComponentType<Record<string, unknown>>,
  <ErrorScreen shouldShowBackButton />,
);
