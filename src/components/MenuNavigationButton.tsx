import * as React from 'react';

import MenuButton from './MenuButton';

type Props = {
  onPress: () => void;
};

export const MenuNavigationButton = <
  TOtherProps extends Omit<React.ComponentProps<typeof MenuButton>, 'onPress'>,
>({
  onPress,
  ...otherProps
}: Props & TOtherProps) => {
  return <MenuButton {...otherProps} onPress={onPress} />;
};

export default MenuNavigationButton;
