import * as React from 'react';

import { StyleSheet, View } from 'react-native';

import { Modal } from 'components/modals/Modal';
import { COLORS } from 'theme';
import { HardwareSetupGuide } from 'components/HardwareSetupGuide';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    flex: 1,
  },
});

interface Props {
  isVisible: boolean;
  onHideModal: () => void;
}

const HardwareSetupModal = ({
  isVisible,
  onHideModal,
}: Props): React.ReactElement => (
  <Modal
    hardwareAccelerated
    isTouchable={false}
    isVisible={isVisible}
    shouldHideOnRequestClose={false}
  >
    <View style={styles.container}>
      <HardwareSetupGuide onClosePress={onHideModal} />
    </View>
  </Modal>
);

export { HardwareSetupModal };
