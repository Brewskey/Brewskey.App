// @flow

import type { Badge } from '../badges';

import * as React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { BADGE_IMAGE_SIZES } from '../badges';

type Props = {|
  badge: Badge,
  onPress?: (badge: Badge) => void,
  size: 'large' | 'small',
|};

// todo maybe pass achievement instead of type, it will simplify things a bit
class BadgeIcon extends React.PureComponent<Props> {
  static defaultProps = {
    size: 'small',
  };

  _onPress = () => this.props.onPress && this.props.onPress(this.props.badge);

  render() {
    const { badge, size } = this.props;
    return (
      <TouchableOpacity disabled={!this.props.onPress} onPress={this._onPress}>
        <Image
          source={badge.image[size]}
          style={{
            height: BADGE_IMAGE_SIZES[size],
            width: BADGE_IMAGE_SIZES[size],
          }}
        />
      </TouchableOpacity>
    );
  }
}

export default BadgeIcon;
