// @flow

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from './Modal';
import { COLORS } from '../../theme';
import HardwareSetupGuide from '../HardwareSetupGuide';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    flex: 1,
  },
});

type Props = {|
  isVisible: boolean,
  onHideModal: () => void,
|};

const HardwareSetupModal = ({ isVisible, onHideModal }: Props): React.Node => (
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

export default HardwareSetupModal;
