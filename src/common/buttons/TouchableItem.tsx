// https://github.com/react-community/react-navigation/blob/master/src/views/TouchableItem.js
/**
 * TouchableItem renders a touchable that looks native on both iOS and Android.
 *
 * It provides an abstraction on top of TouchableNativeFeedback and
 * TouchableOpacity.
 *
 * On iOS you can pass the props of TouchableOpacity, on Android pass the props
 * of TouchableNativeFeedback.
 */

import * as React from 'react';
import {
  Platform,
  StyleProp,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

const ANDROID_VERSION_LOLLIPOP = 21;

export type Props = {
  shouldBeBorderless?: boolean;
  children?: React.ReactNode;
  delayPressIn?: number;
  onPress?: () => void | Promise<void>;
  pressColor?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
};

const TouchableItem: React.FC<Props> = ({
  shouldBeBorderless = false,
  children,
  pressColor = 'rgba(0, 0, 0, .32)',
  style,
  testID,
  ...rest
}) => {
  const { pointerEvents, ...restProps } = rest;
  const combinedStyle = [style, pointerEvents && { pointerEvents }];
  /*
   * TouchableNativeFeedback.Ripple causes a crash on old Android versions,
   * therefore only enable it on Android Lollipop and above.
   *
   * All touchables on Android should have the ripple effect according to
   * platform design guidelines.
   * We need to pass the background prop to specify a borderless ripple effect.
   */
  if (
    Platform.OS === 'android' &&
    Platform.Version >= ANDROID_VERSION_LOLLIPOP
  ) {
    return (
      <TouchableNativeFeedback
        {...restProps}
        background={TouchableNativeFeedback.Ripple(
          pressColor,
          shouldBeBorderless,
        )}
        testID={testID}
      >
        <View style={combinedStyle}>{React.Children.only(children)}</View>
      </TouchableNativeFeedback>
    );
  }
  return (
    <TouchableOpacity {...restProps} style={combinedStyle} testID={testID}>{children}</TouchableOpacity>
  );
};

export default TouchableItem;
