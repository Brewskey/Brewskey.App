// @flow

import * as React from 'react';
import styled from 'styled-components/native';
import CachedImage from '../CachedImage';

const StyledCachedImage = styled(CachedImage)`
  border-radius: ${({ size }: Object): number => size / 2};
  height: ${({ size }: Object): number => size};
  width: ${({ size }: Object): number => size};
`;

const StyledTouchableOpacity = styled.TouchableOpacity`
  background-color: #aaa;
  border-radius: ${({ size }: Object): number => size / 2};
  height: ${({ size }: Object): number => size};
  width: ${({ size }: Object): number => size};
`;

export type BaseAvatarProps = {
  imageRef?: React.Ref<typeof CachedImage>,
  mutable?: boolean,
  onPress?: () => void,
  size: number,
};

type Props = BaseAvatarProps & { uri: string };

class BaseAvatar extends React.PureComponent<Props> {
  render() {
    return (
      <StyledTouchableOpacity
        disabled={!this.props.onPress}
        onPress={this.props.onPress}
        size={this.props.size}
      >
        <StyledCachedImage
          innerRef={this.props.imageRef}
          mutable={this.props.mutable}
          size={this.props.size}
          source={{ uri: this.props.uri }}
        />
      </StyledTouchableOpacity>
    );
  }
}

export default BaseAvatar;
