// @flow
import * as React from 'react';
import { Modal as RNModal, TouchableWithoutFeedback } from 'react-native';
import Fragment from '../../common/Fragment';
import StatusBarFake from './StatusBarFake';

const emptyFunction = () => {};

type Props = {
  animationType?: string, // todo add enum
  children?: React.Node,
  isTouchable?: boolean,
  isVisible: boolean,
  onHideModal?: () => void,
  transparent?: boolean,
  // other RN modal props,
};

const Modal = ({
  animationType = 'slide',
  children,
  isTouchable = true,
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
    <Fragment>
      <StatusBarFake />
      {isTouchable ? (
        <TouchableWithoutFeedback onPress={onHideModal}>
          {children}
        </TouchableWithoutFeedback>
      ) : (
        children
      )}
    </Fragment>
  </RNModal>
);

export default Modal;
