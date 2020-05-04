// @flow
import * as React from 'react';
import { Modal as RNModal, TouchableWithoutFeedback } from 'react-native';
import Fragment from '../../common/Fragment';
import StatusBarFake from './StatusBarFake';

const emptyFunction = () => {};

type Props<RNModalProps> = {|
  ...RNModalProps,
  animationType?: 'none' | 'slide' | 'fade', // todo add enum
  children?: React.Node,
  isTouchable?: boolean,
  isVisible: boolean,
  onHideModal?: () => void,
  shouldHideOnRequestClose?: boolean,
  transparent?: boolean,
  // other RN modal props,
|};

const Modal = <RNModalProps>({
  animationType = 'slide',
  children,
  isTouchable = true,
  isVisible,
  onHideModal,
  shouldHideOnRequestClose = true,
  transparent = true,
  ...rest
}: Props<RNModalProps>): React.Node => (
  <RNModal
    {...rest}
    animationType={animationType}
    onRequestClose={
      shouldHideOnRequestClose && onHideModal ? onHideModal : emptyFunction
    }
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
