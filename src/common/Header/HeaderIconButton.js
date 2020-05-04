// @flow

import * as React from 'react';
import { COLORS } from '../../theme';
import IconButton from '../buttons/IconButton';

const HeaderIconButton = <TProps>(props: TProps): React.Node => (
  <IconButton color={COLORS.textInverse} {...props} />
);

export default HeaderIconButton;
