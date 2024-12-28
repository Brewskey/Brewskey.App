import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import nullthrows from 'nullthrows';
import { COLORS } from '../../theme';
import { TabBarButton } from './TabBarButton';
import { PourButton } from './PourButton';
import BadgeContainer from './BadgeContainer';

// import NotificationsStore from '../../stores/NotificationsStore';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { NavigationRoute, ParamListBase } from '@react-navigation/native';
import TouchableItem from '../../common/buttons/TouchableItem';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    borderTopWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    position: 'relative',
  },
  navContainer: {
    flexDirection: 'row',
    height: 49,
  },
});

const getRouteByRouteName = (
  routeName: string,
  routes: NavigationRoute<ParamListBase, string>[],
): NavigationRoute<ParamListBase, string> =>
  nullthrows(routes.find((route): boolean => route.name === routeName));

const getIndexByRouteName = (
  routeName: string,
  routes: NavigationRoute<ParamListBase, string>[],
): number => routes.findIndex((route): boolean => route.name === routeName);

const NotificationBadges: React.FC<TouchableItem['props']> = (props) => (
  <BadgeContainer
    {...props}
    badgeCount={0 /* NotificationsStore.unreadCount */}
  />
);

const FriendRequestBadge: React.FC<TouchableItem['props']> = (props) => (
  <BadgeContainer {...props} badgeCount={0} />
);

export const MainTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  // return (
  //   <View style={{ flexDirection: 'row' }}>
  //     {state.routes.map((route, index) => {
  //       const { options } = descriptors[route.key];
  //       const label =
  //         options.tabBarLabel !== undefined
  //           ? options.tabBarLabel
  //           : options.title !== undefined
  //             ? options.title
  //             : route.name;

  //       const isFocused = state.index === index;

  //       const onPress = () => {
  //         const event = navigation.emit({
  //           type: 'tabPress',
  //           target: route.key,
  //           canPreventDefault: true,
  //         });

  //         if (!isFocused && !event.defaultPrevented) {
  //           navigation.navigate(route.name, route.params);
  //         }
  //       };

  //       const onLongPress = () => {
  //         navigation.emit({
  //           type: 'tabLongPress',
  //           target: route.key,
  //         });
  //       };

  //       return (
  //         <PlatformPressable
  //           href={buildHref(route.name, route.params)}
  //           accessibilityState={isFocused ? { selected: true } : {}}
  //           accessibilityLabel={options.tabBarAccessibilityLabel}
  //           testID={options.tabBarButtonTestID}
  //           onPress={onPress}
  //           onLongPress={onLongPress}
  //           style={{ flex: 1 }}
  //         >
  //           <Text style={{ color: isFocused ? colors.primary : colors.text }}>
  //             {label}
  //           </Text>
  //         </PlatformPressable>
  //       );
  //     })}
  //   </View>

  const _onTabPress = (
    route: NavigationRoute<ParamListBase, string>,
    isFocused: boolean,
  ) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  return (
    <View style={[styles.container, styles.navContainer]}>
      <TabBarButton
        icon={{ name: 'home' }}
        isFocused={state.index === 0}
        onPress={_onTabPress}
        route={getRouteByRouteName('home', state.routes)}
      />
      <TabBarButton
        icon={{ name: 'chart-pie', type: 'material-community' }}
        isFocused={state.index === 1}
        onPress={_onTabPress}
        route={getRouteByRouteName('stats', state.routes)}
      />
      <PourButton />
      <TabBarButton
        icon={{ name: 'notifications' }}
        iconContainerComponent={NotificationBadges}
        isFocused={state.index === 2}
        onPress={_onTabPress}
        route={getRouteByRouteName('notifications', state.routes)}
      />
      <TabBarButton
        icon={{ name: 'menu' }}
        iconContainerComponent={FriendRequestBadge}
        isFocused={state.index === 3}
        onPress={_onTabPress}
        route={getRouteByRouteName('menu', state.routes)}
      />
    </View>
  );
};
