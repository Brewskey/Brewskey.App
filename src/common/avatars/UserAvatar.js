// @flow

import type { BaseAvatarProps } from './BaseAvatar';

import * as React from 'react';
import CONFIG from '../../config';
import BaseAvatar from './BaseAvatar';

type Props = {
  userName: string,
} & BaseAvatarProps;

class UserAvatar extends React.PureComponent<Props> {
  static defaultProps = {
    rounded: true,
    size: 45,
  };

  render() {
    return (
      <BaseAvatar
        {...this.props}
        source={{
          uri: `${CONFIG.CDN}photos/${this.props.userName}.jpg?w=${
            this.props.size
          }&h=${this.props.size}&mode=crop`,
        }}
      />
    );
  }
}

export default UserAvatar;
