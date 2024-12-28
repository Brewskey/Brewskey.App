import * as React from 'react';
import { HeaderIconButton } from './HeaderIconButton';
import IconButton from '../buttons/IconButton';

type Props = {
  onPress: () => void;
};

export const HeaderNavigationButton = <
  TOtherProps extends React.ComponentProps<typeof IconButton>,
>({
  onPress,
  ...otherProps
}: Props & TOtherProps) => {
  return <HeaderIconButton {...otherProps} onPress={onPress} />;
};
