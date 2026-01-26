import * as React from 'react';

import BaseAvatar from './BaseAvatar';
import CONFIG from '../../config';

import type { BaseAvatarProps } from './BaseAvatar';

type Props = Omit<BaseAvatarProps, 'rounded' | 'size'> & {
  rounded?: boolean;
  size?: number;
  userName: string;
};

const UserAvatar: React.FC<Props> = ({
  userName,
  rounded = true,
  size = 45,
  ...otherProps
}) => (
  <BaseAvatar
    {...otherProps}
    rounded={rounded}
    size={size}
    uri={`${CONFIG.CDN}photos/${userName}.jpg?w=${size}&h=${size}&mode=crop`}
  />
);

export default React.memo(UserAvatar);
