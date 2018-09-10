// @flow
import * as React from 'react';
import { Modal as RNModal, TouchableWithoutFeedback } from 'react-native';

const emptyFunction = () => {};

type Props = {
  animationType?: string, // todo add enum
  children?: React.Node,
  isTouchable?: boolean,
  isVisible: boolean,
  onHideModal?: () => void,
  shouldHideOnRequestClose?: boolean,
  transparent?: boolean,
  // other RN modal props,
};

const Modal = ({
  animationType = 'slide',
  children,
  isTouchable = true,
  isVisible,
  onHideModal,
  shouldHideOnRequestClose = true,
  transparent = true,
  ...rest
}: Props) => (
  <RNModal
    {...rest}
    animationType={animationType}
    onRequestClose={
      shouldHideOnRequestClose && onHideModal ? onHideModal : emptyFunction
    }
    transparent={transparent}
    visible={isVisible}
  >
    {isTouchable ? (
      <TouchableWithoutFeedback onPress={onHideModal}>
        {children}
      </TouchableWithoutFeedback>
    ) : (
      children
    )}
  </RNModal>
);

export default Modal;
