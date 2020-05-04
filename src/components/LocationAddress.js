// @flow

import type { Location } from 'brewskey.js-api';

import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
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

type Props = {|
  location: Location,
|};

@observer
class LocationAddress extends React.Component<Props> {
  @observable _isMapVisible = false;

  @action
  _toggleMapModal = () => {
    this._isMapVisible = !this._isMapVisible;
  };

  render(): React.Node {
    const {
      city,
      geolocation,
      state,
      street,
      suite,
      zipCode,
    } = this.props.location;

    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {`${street.toUpperCase()} ${(suite || '').toUpperCase()}`}
        </Text>
        <Text style={styles.text}>
          {`${city.toUpperCase()} ${(
            state || ''
          ).toUpperCase()} ${zipCode.toString().toUpperCase()}`}
        </Text>
        <Text style={styles.text}>USA</Text>
        {geolocation && [
          <View key="mapButton" style={styles.mapButtonContainer}>
            <IconButton
              color={COLORS.primary2}
              onPress={this._toggleMapModal}
              name="earth"
              size={40}
              type="material-community"
            />
          </View>,
          <LocationMapModal
            key="mapModal"
            isVisible={this._isMapVisible}
            onHideModal={this._toggleMapModal}
            coordinates={geolocation.coordinates}
          />,
        ]}
      </View>
    );
  }
}

export default LocationAddress;
