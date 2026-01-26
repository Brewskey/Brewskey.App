import * as React from 'react';

import { useRouter } from 'expo-router';

import { HeaderIconButton } from './HeaderIconButton';

import type { Href } from 'expo-router';

import type IconButton from '../buttons/IconButton';

type HeaderNavigationButtonProps = React.ComponentProps<typeof IconButton> & {
  href: Href;
};

export const HeaderNavigationButton: React.FC<HeaderNavigationButtonProps> = (
  props,
) => {
  const router = useRouter();
  const { href, testID, ...otherProps } = props;

  const handlePress = () => {
    console.log('handlePress', href);

    try {
      router.navigate(href);
    } catch (error) {
      console.error('Error pushing to href', error);
    }
  };

  return (
    <HeaderIconButton {...otherProps} onPress={handlePress} testID={testID} />
  );
};
