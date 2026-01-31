import { COLORS } from 'theme';
import { IconButton } from 'common/buttons/IconButton';

import type { ComponentProps, FC, ReactElement } from 'react';

export const HeaderIconButton: FC<ComponentProps<typeof IconButton>> = (
  props: ComponentProps<typeof IconButton>,
): ReactElement => <IconButton color={COLORS.textInverse} {...props} />;
