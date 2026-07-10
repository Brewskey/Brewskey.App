import * as React from 'react';

import {
  Modal as RNModal,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const emptyFunction = () => {};

// iOS reports a generous safe area inset which leaves visible breathing
// room between the camera cutout / home indicator and the modal content.
// Subtract that breathing room to keep modal content snug to the cutouts.
// Mirrors IOS_TOP_INSET_TRIM in src/routes/_layout.tsx.
const IOS_INSET_TRIM = 11;

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
  const paddingTop =
    Platform.OS === 'ios'
      ? Math.max(insets.top - IOS_INSET_TRIM, 20)
      : insets.top;
  const paddingBottom =
    Platform.OS === 'ios'
      ? Math.max(insets.bottom - IOS_INSET_TRIM, 0)
      : insets.bottom;

  const content = (
    <View style={{ flex: 1, paddingTop, paddingBottom }}>{children}</View>
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
      {isTouchable ? (
        <TouchableWithoutFeedback onPress={onHideModal}>
          {content}
        </TouchableWithoutFeedback>
      ) : (
        content
      )}
    </RNModal>
  );
};

export { Modal };
