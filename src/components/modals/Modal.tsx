import * as React from 'react';

import { Modal as RNModal, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fragment } from 'common/Fragment';
import { StatusBarFake } from 'components/modals/StatusBarFake';

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
}: Props<RNModalProps>): React.ReactElement => {
  const insets = useSafeAreaInsets();
  // Inset content from the bottom so it doesn't render under the Android
  // navigation bar (or iOS home indicator). Top inset is handled by
  // StatusBarFake / individual modals as needed.
  const content = (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>{children}</View>
  );
  return (
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
            {content}
          </TouchableWithoutFeedback>
        ) : (
          content
        )}
      </Fragment>
    </RNModal>
  );
};

export { Modal };
