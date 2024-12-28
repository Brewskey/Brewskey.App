import * as React from 'react';
import { COLORS } from '../../theme';
import IconButton from '../buttons/IconButton';

export const HeaderIconButton: React.FC<
  React.ComponentProps<typeof IconButton>
> = (props: React.ComponentProps<typeof IconButton>): React.ReactElement => (
  <IconButton color={COLORS.textInverse} {...props} />
);
