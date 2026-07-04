import * as React from 'react';

import { Icon } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { FormProvider, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { Container } from 'common/Container';
import { SubmitButton } from 'common/form/SubmitButton';
import { Header } from 'common/Header';
import { SectionContent } from 'common/SectionContent';
import { LocationPicker } from 'components/pickers/LocationPicker';
import {
  useGetLocationById,
  useGetLocations,
  useGetLocationsCount,
} from 'hooks/queries/LocationQueries';
import { COLORS, TYPOGRAPHY } from 'theme';

import type { EntityID } from '@brewskey/js-api';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 16,
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

interface FormData {
  locationId: EntityID;
}

const NuxLocationScreen: React.FC = () => {
  const router = useRouter();
  const { data: locationsCount } = useGetLocationsCount();
  const { data: locationsData } = useGetLocations({ take: 1 });

  const form = useForm<FormData>();

  // Watch the form value to get selectedLocation
  const selectedLocationId = form.watch('locationId');
  const { data: selectedLocation } = useGetLocationById(selectedLocationId);

  const singleLocation =
    locationsData?.pages?.[0]?.[0] ?? selectedLocation ?? null;

  const hasNoLocation = locationsCount === 0;
  const hasOneLocation = locationsCount === 1;
  const hasManyLocations = locationsCount != null && locationsCount > 1;

  const handleContinuePress = (formData: FormData) => {
    if (hasNoLocation) {
      router.navigate({
        pathname: '/locations/new',
        params: { returnTo: 'nux-wifi', showBackButton: 'false' },
      });
      return;
    }

    const locationId = hasOneLocation
      ? singleLocation?.id
      : (formData.locationId ?? selectedLocationId ?? selectedLocation?.id);

    if (locationId != null) {
      router.navigate({
        pathname: '/wifi',
        params: { locationId: String(locationId) },
      });
    }
  };

  return (
    <FormProvider {...form}>
      <Container>
        <Header shouldShowBackButton title="1. Setup location" />
        <View style={styles.container} testID="nux-location-content">
          <Icon
            // rneui v5 typings dropped the vector-icon props after the
            // vector-icons migration; the runtime still forwards them.
            {...{ color: COLORS.textInverse, name: 'map-marker', size: 200 }}
            containerStyle={styles.iconContainer}
            type="material-design"
          />
          <Text
            style={styles.descriptionText}
            testID="nux-location-description"
          >
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
            <LocationPicker
              defaultValue={selectedLocation}
              name="locationId"
              required="Location is required"
              testID="picker-location-nux"
            />
          ) : null}
          <SectionContent paddedVertical>
            <SubmitButton<FormData>
              allowSubmitWhenValid={hasNoLocation || hasOneLocation}
              disabled={hasManyLocations ? !selectedLocation : false}
              onSubmit={handleContinuePress}
              testID="button-next"
              title="Next"
            />
          </SectionContent>
        </View>
      </Container>
    </FormProvider>
  );
};

export default NuxLocationScreen;
