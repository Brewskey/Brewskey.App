// @flow

import type { Navigation } from '../../types';

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import nullthrows from 'nullthrows';
import { COLORS } from '../../theme';
import TabBarButton from './TabBarButton';
import PourButton from './PourButton';
import BadgeContainer from './BadgeContainer';
import { observer } from 'mobx-react/native';
import NotificationsStore from '../../stores/NotificationsStore';
import FriendRequestsListStore from '../../stores/FriendRequestsListStore';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    height: 49,
    overflow: 'hidden',
    position: 'relative',
  },
});

const getRouteByRouteName = (
  routeName: string,
  routes: Array<Object>,
): Object =>
  nullthrows(
    routes.find((route: Object): boolean => route.routeName === routeName),
  );

const getIndexByRouteName = (
  routeName: string,
  routes: Array<Object>,
): number =>
  routes.findIndex((route: Object): boolean => route.routeName === routeName);

type Props = {
  jumpTo: (key: string) => void,
  navigation: Navigation,
  onTabPress: ({ route: Object }) => void,
  // other props from createMaterialTopTabNavigator
};

class MainTabBar extends React.Component<Props> {
  // the logic is stolen from there:
  // https://github.com/react-navigation/react-navigation-tabs/blob/master/src/views/BottomTabBar.js#L203-L205
  _onTabPress = route => {
    const { jumpTo, onTabPress } = this.props;
    jumpTo(route.key);
    onTabPress({ route });
  };

  render() {
    const {
      navigation: { state },
    } = this.props;
    const currentIndex = state.index;

    return (
      <View style={styles.container}>
        <TabBarButton
          icon={{ name: 'home' }}
          isFocused={currentIndex === getIndexByRouteName('home', state.routes)}
          onPress={this._onTabPress}
          route={getRouteByRouteName('home', state.routes)}
        />
        <TabBarButton
          icon={{ name: 'chart-pie', type: 'material-community' }}
          isFocused={
            currentIndex === getIndexByRouteName('stats', state.routes)
          }
          onPress={this._onTabPress}
          route={getRouteByRouteName('stats', state.routes)}
        />
        <PourButton />
        <TabBarButton
          icon={{ name: 'notifications' }}
          iconContainerComponent={NotificationBadges}
          isFocused={
            currentIndex === getIndexByRouteName('notifications', state.routes)
          }
          onPress={this._onTabPress}
          route={getRouteByRouteName('notifications', state.routes)}
        />
        <TabBarButton
          icon={{ name: 'menu' }}
          iconContainerComponent={FriendRequestBadge}
          isFocused={currentIndex === getIndexByRouteName('menu', state.routes)}
          onPress={this._onTabPress}
          route={getRouteByRouteName('menu', state.routes)}
        />
      </View>
    );
  }
}

const NotificationBadges = observer((props: any) => (
  <BadgeContainer {...props} badgeCount={NotificationsStore.unreadCount} />
));

const FriendRequestBadge = observer((props: any) => (
  <BadgeContainer
    {...props}
    badgeCount={FriendRequestsListStore.pendingRequestsCount}
  />
));

export default MainTabBar;
