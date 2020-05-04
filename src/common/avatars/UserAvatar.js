// @flow

import type { BaseAvatarProps } from './BaseAvatar';

import * as React from 'react';
import CONFIG from '../../config';
import BaseAvatar from './BaseAvatar';

type Props = {|
  ...BaseAvatarProps,
  userName: string,
|};

class UserAvatar extends React.PureComponent<Props> {
  static defaultProps: {| rounded: boolean, size: number |} = {
    rounded: true,
    size: 45,
  };

  render(): React.Node {
    const { userName, ...otherProps } = this.props;
    return (
      <BaseAvatar
        {...otherProps}
        uri={`${CONFIG.CDN}photos/${userName}.jpg?w=${this.props.size}&h=${this.props.size}&mode=crop`}
      />
    );
  }
}

export default UserAvatar;
