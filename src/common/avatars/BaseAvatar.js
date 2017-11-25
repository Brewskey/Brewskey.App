// @flow

import * as React from 'react';
import styled from 'styled-components/native';
import CachedImage from '../CachedImage';

const StyledCachedImage = styled(CachedImage)`
  border-radius: ${({ rounded, size }: Object): number =>
    rounded ? size / 2 : 10};
  height: ${({ size }: Object): number => size};
  width: ${({ size }: Object): number => size};
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  background-color: #eee;
  border-radius: ${({ rounded, size }: Object): number =>
    rounded ? size / 2 : 10};
  height: ${({ size }: Object): number => size};
  width: ${({ size }: Object): number => size};
`;

export type BaseAvatarProps = {
  imageRef?: React.Ref<typeof CachedImage>,
  mutable?: boolean,
  onPress?: () => void,
  rounded?: boolean,
  size: number,
  style?: Object,
};

type Props = BaseAvatarProps & { uri: string };

class BaseAvatar extends React.PureComponent<Props> {
  render() {
    const {
      imageRef,
      mutable,
      onPress,
      rounded,
      size,
      style,
      uri,
    } = this.props;
    return (
      <StyledTouchableOpacity
        disabled={!onPress}
        onPress={onPress}
        rounded={rounded}
        size={size}
        style={style}
      >
        <StyledCachedImage
          innerRef={imageRef}
          mutable={mutable}
          rounded={rounded}
          size={size}
          source={{ uri }}
          style={style}
        />
      </StyledTouchableOpacity>
    );
  }
}

export default BaseAvatar;
