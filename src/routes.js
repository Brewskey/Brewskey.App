// @flow

import * as React from 'react';
import { TabNavigator } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';

const RootRouter = TabNavigator({
  home: { screen: HomeScreen },
  login: { screen: LoginScreen },
});

export default RootRouter;
