// @flow

import type { EntityID } from 'brewskey.js-api';
import type { BaseAvatarProps } from './BaseAvatar';

import * as React from 'react';
import CONFIG from '../../config';
import BaseAvatar from './BaseAvatar';

type Props = {
  beverageId: EntityID,
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
        uri={`${
          CONFIG.CDN
        }beverages/${this.props.beverageId.toString()}-icon.jpg?w=${
          this.props.size
        }&h=${this.props.size}&mode=crop`}
      />
    );
  }
}

export default BeverageAvatar;
