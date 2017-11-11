// @flow

import * as React from 'react';
import styled from 'styled-components/native';
import CachedImage from './CachedImage';
import { TouchableOpacity } from 'react-native';
import CONFIG from '../config';

const StyledCachedImage = styled(CachedImage)`
  border-radius: ${({ size }: Object): number => size / 2};
  height: ${({ size }: Object): number => size};
  width: ${({ size }: Object): number => size};
`;

type Props = {
  imageRef?: React.Ref<typeof CachedImage>,
  onPress?: () => void,
  size: number,
  userName: string,
};

class Avatar extends React.Component<Props> {
  static defaultProps = {
    size: 90,
  };

  get _uri(): string {
    return `${CONFIG.CDN}photos/${this.props.userName}.jpg?w=${
      this.props.size
    }&h=${this.props.size}&mode=crop`;
  }

  render() {
    return (
      <TouchableOpacity
        disabled={!this.props.onPress}
        onPress={this.props.onPress}
      >
        <StyledCachedImage
          innerRef={this.props.imageRef}
          size={this.props.size}
          source={{ uri: this._uri }}
        />
      </TouchableOpacity>
    );
  }
}

export default Avatar;
