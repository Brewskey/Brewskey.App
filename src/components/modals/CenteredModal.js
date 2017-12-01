// @flow

import type { Node } from 'react';

import React, { Component } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { observer } from 'mobx-react';

const emptyFunction = () => {};

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
    backgroundColor: 'rgb(35,131,147)',
  },
});

type Props = {|
  children?: Node,
  header?: Node,
  isVisible: boolean,
  onHideModal: () => void,
|};

@observer
class CenteredModal extends Component<Props> {
  render() {
    const { children, header, isVisible, onHideModal } = this.props;
    return (
      <Modal
        animationType="slide"
        onRequestClose={emptyFunction}
        transparent
        visible={isVisible}
      >
        <TouchableWithoutFeedback onPress={onHideModal}>
          <View style={styles.container}>
            <TouchableWithoutFeedback onPress={emptyFunction}>
              <View style={styles.modal}>
                {!header ? null : <View style={styles.header}>{header}</View>}
                <View style={styles.content}>{children}</View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export default CenteredModal;
