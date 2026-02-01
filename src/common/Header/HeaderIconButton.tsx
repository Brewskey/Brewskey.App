import { IconButton } from 'common/buttons/IconButton';
import { COLORS } from 'theme';

import type { ComponentProps, FC, ReactElement } from 'react';

export const HeaderIconButton: FC<ComponentProps<typeof IconButton>> = (
  props: ComponentProps<typeof IconButton>,
): ReactElement => <IconButton color={COLORS.textInverse} {...props} />;
