import * as React from 'react';

import { BaseAvatar } from 'common/avatars/BaseAvatar';
import { createUserProfileCdnUrl } from 'utils/userProfileCdnUrl';

import type { BaseAvatarProps } from 'common/avatars/BaseAvatar';

type Props = Omit<BaseAvatarProps, 'rounded' | 'size'> & {
  rounded?: boolean;
  size?: number;
  userName: string;
};

const UserAvatarComponent: React.FC<Props> = ({
  userName,
  rounded = true,
  size = 45,
  ...otherProps
}) => (
  <BaseAvatar
    {...otherProps}
    rounded={rounded}
    size={size}
    uri={createUserProfileCdnUrl(userName, size)}
  />
);

export const UserAvatar = React.memo(UserAvatarComponent);
