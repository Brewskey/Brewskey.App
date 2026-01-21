import * as React from 'react';
import { HeaderIconButton } from './HeaderIconButton';
import IconButton from '../buttons/IconButton';
import { Href, useRouter } from 'expo-router';

type HeaderNavigationButtonProps = React.ComponentProps<typeof IconButton> & {
  href?: Href;
  // Legacy React Navigation props (for backward compatibility during migration)
  screen?: string;
  params?: any;
};

export const HeaderNavigationButton: React.FC<HeaderNavigationButtonProps> = (props) => {
  const router = useRouter();
  const { href, screen, params, testID, ...otherProps } = props;
  
  const handlePress = () => {
    if (href) {
      router.navigate(href);
    } else if (screen) {
      // Legacy navigation - convert to expo-router paths
      // This is a fallback for screens not yet migrated
      console.warn('HeaderNavigationButton: screen prop is deprecated, use href instead');
      // Try to construct href from screen path
      router.navigate(screen as any);
    }
  };

  return <HeaderIconButton {...otherProps} testID={testID} onPress={handlePress} />;
};
