import type { EntityID } from '@brewskey/js-api';
import type { BaseAvatarProps } from './BaseAvatar';

import * as React from 'react';
import CONFIG from '../../config';
import BaseAvatar from './BaseAvatar';

type Props = Omit<BaseAvatarProps, 'rounded' | 'size'> & {
  beverageId: EntityID | null | undefined;
  cached?: boolean;
  rounded?: boolean;
  size?: number;
  uri?: string | null | undefined;
};

const BeverageAvatar: React.FC<Props> = ({
  beverageId,
  cached = true,
  rounded = true,
  size = 45,
  uri,
  ...otherProps
}) => {
  const beverageIdString = beverageId != null ? beverageId.toString() : '';

  if (beverageIdString == '') {
    return null;
  }

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
      size={size}
    />
  );
};

export default React.memo(BeverageAvatar);
