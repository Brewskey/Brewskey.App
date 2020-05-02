// @flow

import type { Style } from '../../types';

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import Modal from './Modal';

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

type Props = {|
  children?: React.Node,
  contentContainerStyle?: Style,
  header?: React.Node,
  isVisible: boolean,
  onHideModal: () => void,
  width?: number | string,
|};

@observer
class CenteredModal extends React.Component<Props> {
  _onPress = () => {};

  render() {
    const {
      children,
      contentContainerStyle,
      header,
      isVisible,
      onHideModal,
      width,
    } = this.props;

    return (
      <Modal isVisible={isVisible} onHideModal={onHideModal}>
        <View style={styles.container}>
          <View
            onStartShouldSetResponder={() => true}
            style={[styles.modal, { maxHeight: '80%', width }]}
          >
            {!header ? null : <View style={styles.header}>{header}</View>}
            <View style={[styles.content, contentContainerStyle]}>
              {children}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default CenteredModal;
