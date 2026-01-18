import type { Coordinates } from '@brewskey/js-api';

import * as React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { GOOGLE_MAPS_API_KEY } from '../constants';

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

// todo marker is not visible for some reason
// todo not sure if this right formula for deltas
// it should be depends on map width/height I think
// https://github.com/react-community/react-native-maps/issues/505
const getRegion = (
  { latitude, longitude }: Coordinates,
  distance: number,
): Region => {
  const oneDegreeOfLatitudeInMeters = 111.32 * 1000;

  const latitudeDelta = distance / oneDegreeOfLatitudeInMeters;
  const longitudeDelta =
    distance /
    (oneDegreeOfLatitudeInMeters * Math.cos(latitude * (Math.PI / 180)));

  return {
    latitude,
    latitudeDelta,
    longitude,
    longitudeDelta,
  };
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

type Props = {
  coordinates: Coordinates;
  zoomDistance?: number;
};

const LocationMap = ({
  coordinates: { latitude, longitude },
  zoomDistance = 2000,
}: Props): React.ReactElement => (
  <MapView
    provider="google"
    googleMapsApiKey={GOOGLE_MAPS_API_KEY}
    style={styles.map}
    initialRegion={getRegion(
      {
        latitude,
        longitude,
      },
      zoomDistance,
    )}
  >
    <Marker
      coordinate={{
        latitude,
        longitude,
      }}
    />
  </MapView>
);

export default LocationMap;
