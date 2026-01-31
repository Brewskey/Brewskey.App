import * as React from 'react';

import { MenuButton } from 'components/MenuButton';

interface Props {
  onPress: () => void;
}

export const MenuNavigationButton = <
  TOtherProps extends Omit<React.ComponentProps<typeof MenuButton>, 'onPress'>,
>({
  onPress,
  ...otherProps
}: Props & TOtherProps) => <MenuButton {...otherProps} onPress={onPress} />;
