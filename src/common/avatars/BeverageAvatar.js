// @flow

import type { EntityID } from 'brewskey.js-api';
import type { BaseAvatarProps } from './BaseAvatar';

import * as React from 'react';
import CONFIG from '../../config';
import BaseAvatar from './BaseAvatar';

type Props = {
  beverageId: ?EntityID,
  cached?: boolean,
  uri?: ?string,
} & BaseAvatarProps;

class BeverageAvatar extends React.PureComponent<Props> {
  static defaultProps = {
    cached: true,
    rounded: true,
    size: 45,
  };

  render() {
    const { beverageId, cached, rounded, size, uri } = this.props;
    const beverageIdString = beverageId ? beverageId.toString() : '';

    return (
      <BaseAvatar
        {...this.props}
        rounded={rounded}
        uri={
          uri ||
          `${
            CONFIG.CDN
          }beverages/${beverageIdString}-icon.jpg?w=${size}&h=${size}&trim.threshold=90&mode=crop&${
            cached ? '' : new Date().toString()
          }`
        }
      />
    );
  }
}

export default BeverageAvatar;
