// @flow

import * as React from 'react';
import CachedImage from '../CachedImage';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: COLORS.secondary2,
  },
});

export type BaseAvatarProps = {
  imageRef?: React.Ref<typeof CachedImage>,
  mutable?: boolean,
  onPress?: () => void,
  rounded: boolean,
  size: number,
};

type Props = BaseAvatarProps & { uri: ?string };

class BaseAvatar extends React.PureComponent<Props> {
  static defaultProps = {
    rounded: true,
    size: 45,
  };

  render() {
    const { imageRef, mutable, onPress, rounded, size, uri } = this.props;
    const containerStyle = [
      {
        height: size,
        width: size,
      },
      rounded && { borderRadius: size / 2 },
    ];

    return (
      <TouchableOpacity
        disabled={!onPress}
        onPress={onPress}
        size={size}
        style={[containerStyle, styles.avatar]}
      >
        {uri ? (
          <CachedImage
            ref={imageRef}
            mutable={mutable}
            size={size}
            source={{ uri }}
            style={containerStyle}
          />
        ) : null}
      </TouchableOpacity>
    );
  }
}

export default BaseAvatar;
