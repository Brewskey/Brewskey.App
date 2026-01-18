import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as React from 'react';
import { HeaderIconButton } from './HeaderIconButton';

export const HeaderBackButton: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
  return (
    <HeaderIconButton name="arrow-back" onPress={() => navigation.goBack()} />
  );
};

export default HeaderBackButton;
