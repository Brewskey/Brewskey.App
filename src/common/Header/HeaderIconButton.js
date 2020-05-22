// @flow

import * as React from 'react';
import { COLORS } from '../../theme';
import IconButton from '../buttons/IconButton';

const HeaderIconButton = (
  props: React.ElementProps<typeof IconButton>,
): React.Node => <IconButton color={COLORS.textInverse} {...props} />;

export default HeaderIconButton;
