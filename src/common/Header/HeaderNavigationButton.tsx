import * as React from 'react';
import { HeaderIconButton } from './HeaderIconButton';
import IconButton from '../buttons/IconButton';
import { Href, useRouter } from 'expo-router';

type HeaderNavigationButtonProps = React.ComponentProps<typeof IconButton> & {
  href: Href;
};

export const HeaderNavigationButton: React.FC<HeaderNavigationButtonProps> = (props) => {
  const router = useRouter();
  const { href,  testID, ...otherProps } = props;
  
  const handlePress = () => {
    console.log('handlePress', href);

    try {
      router.navigate(href);
    } catch (error) {
      console.error('Error pushing to href', error);
    }
  };

  return <HeaderIconButton {...otherProps} testID={testID} onPress={handlePress} />;
};
