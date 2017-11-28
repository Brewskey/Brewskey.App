// @flow

import * as React from 'react';
import CachedImage from '../CachedImage';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: COLORS.outline2,
  },
});

export type BaseAvatarProps = {
  imageRef?: React.Ref<typeof CachedImage>,
  mutable?: boolean,
  onPress?: () => void,
  size: number,
};

type Props = BaseAvatarProps & { uri: string };

class BaseAvatar extends React.PureComponent<Props> {
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
        <CachedImage
          innerRef={imageRef}
          mutable={mutable}
          size={size}
          source={{ uri }}
          style={containerStyle}
        />
      </TouchableOpacity>
    );
  }
}

export default BaseAvatar;
