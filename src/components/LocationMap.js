// @flow

import type { Coordinates } from 'brewskey.js-api';

import * as React from 'react';
import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';

type Region = {|
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
|};

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
    // height:
    // width: '100%',
  },
});

type Props = {|
  coordinates: Coordinates,
  zoomDistance?: number,
|};

const LocationMap = ({ coordinates, zoomDistance = 1000 }: Props) => (
  <MapView
    style={styles.map}
    initialRegion={getRegion(coordinates, zoomDistance)}
  >
    <MapView.Marker coordinate={coordinates} />
  </MapView>
);

export default LocationMap;
