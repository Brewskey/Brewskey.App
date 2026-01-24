import * as React from 'react';
import {
  DimensionValue,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

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

type Props = {
  children?: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  header?: React.ReactNode;
  isVisible: boolean;
  onHideModal: () => void;
  testID?: string;
  width?: DimensionValue;
};

const CenteredModal: React.FC<Props> = ({
  children,
  contentContainerStyle,
  header,
  isVisible,
  onHideModal,
  testID,
  width,
}) => {
  return (
    <Modal
      visible={isVisible}
      onRequestClose={onHideModal}
      testID={testID}
      transparent={true}
    >
      <View style={styles.container}>
        <Pressable style={styles.backdrop} onPress={onHideModal} />
        <View style={[styles.modal, width != null && { width }]}>
          {!header ? null : <View style={styles.header}>{header}</View>}
          <View style={[styles.content, contentContainerStyle]}>
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CenteredModal;
