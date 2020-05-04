/* @flow */
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

import type { Style } from '../../types';
import * as React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';

const ANDROID_VERSION_LOLLIPOP = 21;

type Props = {|
  borderless?: boolean,
  children?: React.Node,
  delayPressIn?: number,
  onPress?: () => void | Promise<void>,
  pressColor?: string,
  style?: Style,
|};

export default class TouchableItem extends React.Component<Props> {
  static defaultProps: {| borderless: boolean, pressColor: string |} = {
    borderless: false,
    pressColor: 'rgba(0, 0, 0, .32)',
  };

  render(): React.Node {
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
      const { borderless, pressColor, style, ...rest } = this.props;
      return (
        <TouchableNativeFeedback
          {...rest}
          background={TouchableNativeFeedback.Ripple(
            pressColor || '',
            borderless || false,
          )}
        >
          <View style={style}>{React.Children.only(this.props.children)}</View>
        </TouchableNativeFeedback>
      );
    }
    const { borderless: _, pressColor: _1, ...otherProps } = this.props;
    return (
      <TouchableOpacity {...otherProps}>{this.props.children}</TouchableOpacity>
    );
  }
}
