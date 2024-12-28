import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { HeaderIconButton } from './HeaderIconButton';

export const HeaderBackButton: React.FC = () => {
  const navigation = useNavigation();
  if (!navigation.canGoBack()) {
    return null;
  }

  return (
    <HeaderIconButton name="arrow-back" onPress={() => navigation.goBack()} />
  );
};

export default HeaderBackButton;
