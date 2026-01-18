import type { Location } from '@brewskey/js-api';
import type { PickerValue } from '../components/pickers/DAOPicker';

import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StaticScreenProps, useNavigation, NavigationProp } from '@react-navigation/native';

import { Icon } from '@rneui/themed';
import Button from '../common/buttons/Button';

import Header from '../common/Header';
import Container from '../common/Container';
import LocationPicker from '../components/pickers/LocationPicker';
import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import { COLORS, TYPOGRAPHY } from '../theme';

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

type Props = StaticScreenProps<{
  onContinuePress?: () => undefined | Promise<undefined>;
  locationsCount?: number;
  selectedLocation?: Location;
}>;

const NuxLocationScreen: React.FC<Props> = ({
  route: {
    params: {
      onContinuePress,
      locationsCount = 0,
      selectedLocation: initialSelectedLocation,
    },
  },
}: Props) => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
  
  const [selectedLocation, setSelectedLocation] = useState<Location | null | undefined>(
    initialSelectedLocation || null
  );

  const onLocationChange = (location: PickerValue<Location, false>) => {
    // todo
    // PickerValue: ?TEntity | Array<TEntity>
    // depends on multiple prop, try to find a way to do conditional
    // type on Flow
    setSelectedLocation(location as Location | null | undefined);
  };

  const handleContinuePress = () => {
    if (onContinuePress) {
      // Pass selectedLocation through navigation params for next screens
      navigation.setParams({ selectedLocation } as any);
      onContinuePress();
    }
  };

  const hasNoLocation = locationsCount === 0;
  const hasOneLocation = locationsCount === 1;
  const hasManyLocations = locationsCount > 1;

  return (
    <Container>
      <Header showBackButton title="1. Setup location" />
      <View style={styles.container}>
        <Icon
          color={COLORS.textInverse}
          containerStyle={styles.iconContainer}
          name="map-marker"
          size={200}
          type="material-community"
        />
        <Text style={styles.descriptionText}>
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
          <LocationPicker
            inputStyle={styles.input}
            labelStyle={styles.label}
            multiple={false}
            onChange={onLocationChange}
            placeholderTextColor="white"
            selectionColor="white"
            underlineColorAndroid="white"
            validationTextStyle={styles.validationText}
            value={selectedLocation}
          />
        )}
        <Button
          disabled={
            hasManyLocations && !selectedLocation
          }
          onPress={handleContinuePress}
          secondary
          title="Next"
        />
      </View>
    </Container>
  );
};

export default withErrorBoundary(NuxLocationScreen, <ErrorScreen showBackButton />);
