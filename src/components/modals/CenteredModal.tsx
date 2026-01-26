import * as React from 'react';

import { Modal, Pressable, StyleSheet, View } from 'react-native';

import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },
  content: {
    padding: 12,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 8,
    paddingVertical: 8,
  },
  modal: {
    alignItems: 'stretch',
    backgroundColor: 'rgb(35,131,147)',
    flexDirection: 'column',
    maxHeight: '80%',
  },
});

interface Props {
  children?: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  header?: React.ReactNode;
  isVisible: boolean;
  onHideModal: () => void;
  testID?: string;
  width?: DimensionValue;
}

const CenteredModal: React.FC<Props> = ({
  children,
  contentContainerStyle,
  header,
  isVisible,
  onHideModal,
  testID,
  width,
}) => (
  <Modal
    transparent
    onRequestClose={onHideModal}
    testID={testID}
    visible={isVisible}
  >
    <View style={styles.container}>
      <Pressable onPress={onHideModal} style={styles.backdrop} />
      <View style={[styles.modal, width != null && { width }]}>
        {!header ? null : <View style={styles.header}>{header}</View>}
        <View style={[styles.content, contentContainerStyle]}>{children}</View>
      </View>
    </View>
  </Modal>
);

export default CenteredModal;
