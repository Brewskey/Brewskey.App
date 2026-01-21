import type { Location } from '@brewskey/js-api';

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS, TYPOGRAPHY } from '../theme';
import IconButton from '../common/buttons/IconButton';
import LocationMapModal from './modals/LocationMapModal';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  mapButtonContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  text: {
    ...TYPOGRAPHY.secondary,
  },
});

type Props = {
  location: Location;
};

const LocationAddress: React.FC<Props> = ({ location }) => {
  const [isMapVisible, setIsMapVisible] = React.useState(false);

  const toggleMapModal = () => {
    setIsMapVisible(!isMapVisible);
  };

  const { city, geolocation, state, street, suite, zipCode } = location;

  return (
    <View style={styles.container} testID="location-address">
      <Text style={styles.text} testID="location-address-street">
        {`${street.toUpperCase()} ${(suite || '').toUpperCase()}`}
      </Text>
      <Text style={styles.text} testID="location-address-city-state-zip">
        {`${city.toUpperCase()} ${(
          state || ''
        ).toUpperCase()} ${zipCode.toString().toUpperCase()}`}
      </Text>
      <Text style={styles.text} testID="location-address-country">USA</Text>
      {geolocation && [
        <View key="mapButton" style={styles.mapButtonContainer}>
          <IconButton
            color={COLORS.primary2}
            onPress={toggleMapModal}
            name="earth"
            size={40}
            type="material-community"
          />
        </View>,
        <LocationMapModal
          key="mapModal"
          isVisible={isMapVisible}
          onHideModal={toggleMapModal}
          coordinates={geolocation.coordinates}
        />,
      ]}
    </View>
  );
};

export default LocationAddress;
