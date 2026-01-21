import type { Location } from '@brewskey/js-api';
import type { PickerValue } from '../../../components/pickers/LocationPicker';

import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, FormProvider } from 'react-hook-form';

import { Icon } from '@rneui/themed';
import Button from '../../../common/buttons/Button';

import Header from '../../../common/Header';
import Container from '../../../common/Container';
import { LocationPicker } from '../../../components/pickers';
import ErrorScreen from '../../../common/ErrorScreen';
import { withErrorBoundary } from '../../../common/ErrorBoundary';
import { COLORS, TYPOGRAPHY } from '../../../theme';

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

const NuxLocationScreen: React.FC = () => {
  const router = useRouter();
  const { onContinuePress, locationsCount, selectedLocation: initialSelectedLocation } = useLocalSearchParams<{ 
    onContinuePress?: string;
    locationsCount?: string;
    selectedLocation?: string;
  }>();
  
  const [selectedLocation, setSelectedLocation] = useState<Location | null | undefined>(
    initialSelectedLocation ? JSON.parse(initialSelectedLocation) : null
  );

  // Create a minimal form for LocationPicker2
  const form = useForm<{ location: Location | null | undefined }>({
    defaultValues: {
      location: selectedLocation,
    },
  });

  React.useEffect(() => {
    form.setValue('location', selectedLocation);
  }, [selectedLocation, form]);

  const onLocationChange = (location: Location | null | undefined) => {
    setSelectedLocation(location);
    form.setValue('location', location);
  };

  const handleContinuePress = () => {
    if (onContinuePress) {
      const callback = JSON.parse(onContinuePress);
      callback();
    }
  };

  const locationsCountNum = locationsCount ? parseInt(locationsCount, 10) : 0;
  const hasNoLocation = locationsCountNum === 0;
  const hasOneLocation = locationsCountNum === 1;
  const hasManyLocations = locationsCountNum > 1;

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
          {hasNoLocation &&
            'Okay, the first thing we need to do ' +
              'is to set up a location for your Brewskey box.'}
          {hasOneLocation &&
            `You've already set up the location ${
              selectedLocation
                ? selectedLocation.name
                : ''
            }`}
          {hasManyLocations &&
            'You already created some locations, you need to choose one ' +
              'for further setup.'}
        </Text>
        {hasManyLocations && (
          <FormProvider {...form}>
            <LocationPicker
              name="location"
              multiple={false}
              onChange={onLocationChange}
              value={selectedLocation}
              defaultValue={selectedLocation}
              testID="picker-location-nux"
            />
          </FormProvider>
        )}
        <Button
          disabled={
            hasManyLocations && !selectedLocation
          }
          onPress={handleContinuePress}
          secondary
          testID="button-next"
          title="Next"
        />
      </View>
    </Container>
  );
};

export default withErrorBoundary(NuxLocationScreen, <ErrorScreen shouldShowBackButton />);
