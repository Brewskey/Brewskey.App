import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { IconButton } from 'common/buttons/IconButton';
import { COLORS, TYPOGRAPHY } from 'theme';
import { LocationMapModal } from 'components/modals/LocationMapModal';

import type { Location } from '@brewskey/js-api';

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

interface Props {
  location: Location;
}

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
      <Text style={styles.text} testID="location-address-country">
        USA
      </Text>
      {geolocation
        ? [
            <View key="mapButton" style={styles.mapButtonContainer}>
              <IconButton
                color={COLORS.primary2}
                name="earth"
                onPress={toggleMapModal}
                size={40}
                type="material-community"
              />
            </View>,
            <LocationMapModal
              key="mapModal"
              coordinates={geolocation.coordinates}
              isVisible={isMapVisible}
              onHideModal={toggleMapModal}
            />,
          ]
        : null}
    </View>
  );
};

export { LocationAddress };
