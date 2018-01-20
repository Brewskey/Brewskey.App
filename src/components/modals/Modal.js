// @flow
import * as React from 'react';
import { Modal as RNModal, TouchableWithoutFeedback } from 'react-native';

const emptyFunction = () => {};

type Props = {
  animationType?: string, // todo add enum
  children?: React.Node,
  isVisible: boolean,
  onHideModal: () => void,
  transparent?: boolean,
  // other RN modal props,
};

const Modal = ({
  animationType = 'slide',
  children,
  isVisible,
  onHideModal,
  transparent = true,
  ...rest
}: Props) => (
  <RNModal
    {...rest}
    animationType={animationType}
    onRequestClose={emptyFunction}
    transparent={transparent}
    visible={isVisible}
  >
    <TouchableWithoutFeedback onPress={onHideModal}>
      {children}
    </TouchableWithoutFeedback>
  </RNModal>
);

export default Modal;
