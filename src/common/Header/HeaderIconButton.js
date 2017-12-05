// @flow

import * as React from 'react';
import { COLORS } from '../../theme';
import IconButton from '../buttons/IconButton';

type Props = {
  // IconButton props
};

const HeaderIconButton = (props: Props) => (
  <IconButton color={COLORS.textInverse} {...props} />
);

export default HeaderIconButton;
