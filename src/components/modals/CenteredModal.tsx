import * as React from 'react';
import {
  DimensionValue,
  Modal,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    height: '100%',
    justifyContent: 'center',
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
  },
});

type Props = {
  children?: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  header?: React.ReactNode;
  isVisible: boolean;
  onHideModal: () => void;
  width?: DimensionValue;
};

class CenteredModal extends React.Component<Props> {
  _onPress = () => {};

  render(): React.ReactElement {
    const {
      children,
      contentContainerStyle,
      header,
      isVisible,
      onHideModal,
      width,
    } = this.props;

    return (
      <Modal
        visible={isVisible}
        onRequestClose={onHideModal}
        transparent={true}
      >
        <TouchableOpacity style={styles.container} onPressOut={onHideModal}>
          <TouchableWithoutFeedback style={{ maxHeight: '80%', width }}>
            <View style={styles.modal}>
              {!header ? null : <View style={styles.header}>{header}</View>}
              <View style={[styles.content, contentContainerStyle]}>
                {children}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    );
  }
}

export default CenteredModal;
