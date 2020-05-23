// @flow

import type { Style } from '../../types';

import * as React from 'react';
import CachedImage from '../CachedImage';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: COLORS.secondary2,
  },
});

export type BaseAvatarProps = {|
  cached?: boolean,
  containerStyle?: Style,
  imageRef?: React.Ref<typeof CachedImage>,
  mutable?: boolean,
  onPress?: () => void,
  rounded: boolean,
  size: number,
|};

type Props = {|
  ...BaseAvatarProps,
  uri?: ?string,
|};
class BaseAvatar extends React.PureComponent<Props> {
  static defaultProps: {| cached: boolean, rounded: boolean, size: number |} = {
    cached: true,
    rounded: true,
    size: 45,
  };

  render(): React.Node {
    const {
      cached,
      containerStyle,
      imageRef,
      mutable,
      onPress,
      rounded,
      size,
      uri,
    } = this.props;

    const baseContainerStyle = {
      height: size,
      width: size,
      ...(rounded && { borderRadius: size / 2 }),
    };

    const imageElement = cached ? (
      <CachedImage
        mutable={mutable}
        ref={cached ? imageRef : null}
        source={{ uri: uri || '' }}
        style={baseContainerStyle}
      />
    ) : (
      <Image source={{ uri }} style={baseContainerStyle} />
    );

    return (
      <TouchableOpacity
        disabled={!onPress}
        onPress={onPress}
        style={{ ...baseContainerStyle, ...styles.avatar, ...containerStyle }}
      >
        {uri ? imageElement : null}
      </TouchableOpacity>
    );
  }
}

export default BaseAvatar;
