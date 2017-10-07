// @flow

import * as React from 'react';
import { View } from 'react-native';
import { DrawerItems } from 'react-navigation';
import LogoutButton from './LogoutButton';

// todo to make LogoutButton part of DrawerItems, we need to
// create hucky item object, override onItemPress etc
// so lets keep thins simple for now and do that hucky stuff later
const MainDrawer = (props: Object): React.Element<*> => (
  <View>
    <DrawerItems {...props} />
    <LogoutButton />
  </View>
);

export default MainDrawer;
