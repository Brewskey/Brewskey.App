// @flow

import type { BaseAvatarProps } from './BaseAvatar';

import * as React from 'react';
import CONFIG from '../../config';
import BaseAvatar from './BaseAvatar';

type Props = {
  beverageId: string,
} & BaseAvatarProps;

class BeverageAvatar extends React.PureComponent<Props> {
  static defaultProps = {
    rounded: true,
    size: 45,
  };

  render() {
    return (
      <BaseAvatar
        {...this.props}
        mutable={false}
        rounded={this.props.rounded}
        uri={`${CONFIG.CDN}beverages/${this.props.beverageId}-icon.jpg?w=${
          this.props.size
        }&h=${this.props.size}&mode=crop`}
      />
    );
  }
}

export default BeverageAvatar;
