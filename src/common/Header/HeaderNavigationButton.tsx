import * as React from 'react';
import { HeaderIconButton } from './HeaderIconButton';
import IconButton from '../buttons/IconButton';
import { LinkProps, useLinkProps, useNavigation } from '@react-navigation/native';
import type { NavigationAction } from '@react-navigation/native';

type CustomLinkProps<ParamList extends ReactNavigation.RootParamList> = {
  screen?: keyof ParamList;
  params?: ParamList[keyof ParamList];
  action?: NavigationAction;
  href?: string;
};

export const HeaderNavigationButton = <
  ParamList extends ReactNavigation.RootParamList,
>(props: (LinkProps<ParamList> & React.ComponentProps<typeof IconButton>) | (Omit<React.ComponentProps<typeof IconButton>, 'screen'> & CustomLinkProps<ParamList>)) => {
  const navigation = useNavigation();
  const { screen, params, action, href, ...otherProps } = props;
  
  let linkProps: ReturnType<typeof useLinkProps<ParamList>>;
  if (action) {
    linkProps = useLinkProps<ParamList>({ action } as LinkProps<ParamList>);
  } else if (screen) {
    linkProps = useLinkProps<ParamList>({ 
      screen: screen as keyof ParamList, 
      params: params as ParamList[keyof ParamList] | undefined
    } as LinkProps<ParamList>);
  } else if (href) {
    linkProps = useLinkProps<ParamList>({ href, action: { type: 'NAVIGATE' } as NavigationAction } as LinkProps<ParamList>);
  } else {
    linkProps = useLinkProps<ParamList>({ action: { type: 'NAVIGATE' } as NavigationAction } as LinkProps<ParamList>);
  }
  
  const handlePress = () => {
    if (action) {
      navigation.dispatch(action);
    } else {
      // Use linkProps.onPress() which handles type-safe navigation
      linkProps.onPress();
    }
  };

  return <HeaderIconButton {...otherProps} onPress={handlePress} />;
};
