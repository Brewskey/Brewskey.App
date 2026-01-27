import { useRouter } from 'expo-router';

import { HeaderIconButton } from './HeaderIconButton';

import type { FC } from 'react';

export const HeaderBackButton: FC = () => {
  const router = useRouter();

  const handlePress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback to home if there's no navigation history
      // This can happen with deep links or when the screen is the first in the stack
      router.replace({ pathname: '/(tabs)', params: {} });
    }
  };

  return (
    <HeaderIconButton
      name="arrow-back"
      onPress={handlePress}
      testID="header-back-button"
    />
  );
};
