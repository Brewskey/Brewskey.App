// @flow

import * as React from 'react';
import { COLORS } from '../../theme';
import IconButton from '../buttons/IconButton';

const HeaderIconButton = <TProps>(props: TProps) => (
  <IconButton color={COLORS.textInverse} {...props} />
);

export default HeaderIconButton;
