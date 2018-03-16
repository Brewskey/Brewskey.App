// @flow

import type { Coordinates } from 'brewskey.js-api';

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from './Modal';
import LocationMap from '../LocationMap';
import { COLORS } from '../../theme';
import IconButton from '../../common/buttons/IconButton';

const styles = StyleSheet.create({
  closeButtonContainer: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  container: {
    backgroundColor: COLORS.secondary,
    height: '100%',
    width: '100%',
  },
});

type Props = {|
  coordinates: Coordinates,
  isVisible: boolean,
  onHideModal: () => void,
|};

const LocationMapModal = ({ coordinates, isVisible, onHideModal }: Props) => (
  <Modal isVisible={isVisible}>
    <View style={styles.container}>
      <LocationMap coordinates={coordinates} />
      <View style={styles.closeButtonContainer}>
        <IconButton
          color={COLORS.text}
          name="close"
          onPress={onHideModal}
          size={50}
        />
      </View>
    </View>
  </Modal>
);

export default LocationMapModal;
