import { useRouter } from 'expo-router';

import { HeaderIconButton } from 'common/Header/HeaderIconButton';

import type { Href } from 'expo-router';
import type { ComponentProps, FC } from 'react';

import type { IconButton } from 'common/buttons/IconButton';

type HeaderNavigationButtonProps = ComponentProps<typeof IconButton> & {
  href: Href;
};

export const HeaderNavigationButton: FC<HeaderNavigationButtonProps> = (
  props,
) => {
  const router = useRouter();
  const { href, testID, ...otherProps } = props;

  const handlePress = () => {
    try {
      router.navigate(href);
    } catch (error) {
      // Error navigating to href - silently fail
      // eslint-disable-next-line no-console
      console.error('Error pushing to href', error);
    }
  };

  return (
    <HeaderIconButton {...otherProps} onPress={handlePress} testID={testID} />
  );
};
