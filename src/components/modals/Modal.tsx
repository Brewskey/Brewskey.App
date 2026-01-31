import * as React from 'react';

import { Modal as RNModal, TouchableWithoutFeedback } from 'react-native';

import { StatusBarFake } from 'components/modals/StatusBarFake';
import { Fragment } from 'common/Fragment';

const emptyFunction = () => {};

type Props<RNModalProps> = RNModalProps & {
  animationType?: 'none' | 'slide' | 'fade'; // todo add enum,
  children?: React.ReactNode;
  isTouchable?: boolean;
  isVisible: boolean;
  onHideModal?: () => void;
  shouldHideOnRequestClose?: boolean;
  testID?: string;
  transparent?: boolean;
  // other RN modal props,
};

const Modal = <RNModalProps extends object>({
  animationType = 'slide',
  children,
  isTouchable = true,
  isVisible,
  onHideModal,
  shouldHideOnRequestClose = true,
  testID,
  transparent = true,
  ...rest
}: Props<RNModalProps>): React.ReactElement => (
  <RNModal
    {...rest}
    animationType={animationType}
    testID={testID}
    transparent={transparent}
    visible={isVisible}
    onRequestClose={
      shouldHideOnRequestClose && onHideModal ? onHideModal : emptyFunction
    }
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

export { Modal };
