// @flow

import type { EntityID } from 'brewskey.js-api';
import type { BaseAvatarProps } from './BaseAvatar';

import * as React from 'react';
import CONFIG from '../../config';
import BaseAvatar from './BaseAvatar';

type Props = {|
  ...BaseAvatarProps,
  beverageId: ?EntityID,
  cached?: boolean,
  uri?: ?string,
|};

class BeverageAvatar extends React.PureComponent<Props> {
  static defaultProps = {
    cached: true,
    rounded: true,
    size: 45,
  };

  render() {
    const {
      beverageId,
      cached,
      rounded,
      size,
      uri,
      ...otherProps
    } = this.props;
    const beverageIdString = beverageId != null ? beverageId.toString() : '';

    return (
      <BaseAvatar
        {...otherProps}
        rounded={rounded}
        uri={
          uri ||
          `${
            CONFIG.CDN
          }beverages/${beverageIdString}-icon.jpg?w=${size}&h=${size}&trim.threshold=80&mode=crop&${
            cached ? '' : new Date().toString()
          }`
        }
      />
    );
  }
}

export default BeverageAvatar;
