import * as React from 'react';

import { StyleSheet, View } from 'react-native';

import { Modal } from 'components/modals/Modal';
import { IconButton } from 'common/buttons/IconButton';
import { COLORS } from 'theme';
import { LocationMap } from 'components/LocationMap';

import type { Coordinates } from '@brewskey/js-api';

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

interface Props {
  coordinates: Coordinates;
  isVisible: boolean;
  onHideModal: () => void;
}

const LocationMapModal = ({
  coordinates,
  isVisible,
  onHideModal,
}: Props): React.ReactElement => (
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

export { LocationMapModal };
