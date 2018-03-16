// @flow

import type { Navigation } from '../../types';

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { COLORS } from '../../theme';
import TabBarButton from './TabBarButton';
import PourButton from './PourButton';
import NotificationsIconContainer from './NotificationsIconContainer';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    height: 49,
    overflow: 'visible',
    position: 'relative',
  },
});

const getTabRouteIndex = (routeName: string, routes: Array<Object>): number =>
  routes.findIndex((route: Object): boolean => route.routeName === routeName);

type Props = {
  jumpToIndex: (index: number) => void,
  navigation: Navigation,
  // other props from TabNavigator
};

class MainTabBar extends React.Component<Props> {
  // the logic is stolen from there:
  // https://github.com/react-navigation/react-navigation/blob/master/src/views/TabView/TabBarBottom.js#L180
  _onTabPress = (index: number) => {
    const { jumpToIndex, navigation } = this.props;
    const currentIndex = navigation.state.index;

    if (currentIndex === index) {
      const childRoute = navigation.state.routes[index];
      // eslint-disable-next-line
      if (childRoute.hasOwnProperty('index') && childRoute.index > 0) {
        navigation.dispatch(
          NavigationActions.popToTop({ key: childRoute.key }),
        );
      }
    } else {
      jumpToIndex(index);
    }
  };

  render() {
    const { navigation: { state } } = this.props;
    const currentIndex = state.index;

    const tabRouteIndexByName = {
      home: getTabRouteIndex('home', state.routes),
      menu: getTabRouteIndex('menu', state.routes),
      notifications: getTabRouteIndex('notifications', state.routes),
      stats: getTabRouteIndex('stats', state.routes),
    };

    return (
      <View style={styles.container}>
        <TabBarButton
          icon={{ name: 'home' }}
          index={tabRouteIndexByName.home}
          isFocused={currentIndex === tabRouteIndexByName.home}
          onPress={this._onTabPress}
        />
        <TabBarButton
          icon={{ name: 'chart-pie', type: 'material-community' }}
          index={tabRouteIndexByName.stats}
          isFocused={currentIndex === tabRouteIndexByName.stats}
          onPress={this._onTabPress}
        />
        <PourButton />
        <TabBarButton
          icon={{ name: 'notifications' }}
          iconContainerComponent={NotificationsIconContainer}
          index={tabRouteIndexByName.notifications}
          isFocused={currentIndex === tabRouteIndexByName.notifications}
          onPress={this._onTabPress}
        />
        <TabBarButton
          icon={{ name: 'menu' }}
          index={tabRouteIndexByName.menu}
          isFocused={currentIndex === tabRouteIndexByName.menu}
          onPress={this._onTabPress}
        />
      </View>
    );
  }
}

export default MainTabBar;
