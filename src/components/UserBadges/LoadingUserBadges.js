// @flow

import * as React from 'react';
import LoadingIndicator from '../../common/LoadingIndicator';
import { styles as baseStyles } from './LoadedUserBadges';

const LoadingUserBadges = () => (
  <LoadingIndicator style={baseStyles.container} />
);

export default LoadingUserBadges;
