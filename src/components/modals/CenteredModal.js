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

type Props = {|
  children?: Node,
  header?: Node,
  isVisible: boolean,
  onHideModal: () => void,
|};

const STYLES = StyleSheet.create({
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

@observer
class CenteredModal extends Component<Props> {
  static STYLES = STYLES;
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
          <View style={STYLES.container}>
            <TouchableWithoutFeedback onPress={emptyFunction}>
              <View style={STYLES.modal}>
                {!header ? null : <View style={STYLES.header}>{header}</View>}
                <View style={STYLES.content}>{children}</View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export default CenteredModal;
