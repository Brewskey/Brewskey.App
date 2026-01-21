import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { COLORS } from '../../theme';
import { TabBarButton } from './TabBarButton';
import { PourButton } from './PourButton';
import BadgeContainer from './BadgeContainer';
import TouchableItem from '../../common/buttons/TouchableItem';
import { useMainTabBarSlot } from './MainTabBarSlot';
import { NavigationRoute, ParamListBase } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    borderTopWidth: StyleSheet.hairlineWidth,
    overflow: 'visible',
    position: 'relative',
  },
  navContainer: {
    flexDirection: 'row',
    height: 49,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  pourButtonContainer: {
    position: 'absolute',
    top: -28,
    left: '50%',
    marginLeft: -50,
    zIndex: 10,
  },
});

const NotificationBadges: React.FC<React.ComponentProps<typeof TouchableItem>> = (props) => (
  <BadgeContainer
    {...props}
    badgeCount={0 /* NotificationsStore.unreadCount */}
  />
);

const FriendRequestBadge: React.FC<React.ComponentProps<typeof TouchableItem>> = (props) => (
  <BadgeContainer {...props} badgeCount={0} />
);

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  const { content } = useMainTabBarSlot();

  // When content is set (e.g., Location form), render content instead of tab bar
  if (content !== null) {
    return <View style={styles.container}>{content}</View>;
  }

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigation.navigate(route.name as any, route.params as any);
    }
  };

  return (
    <View style={styles.container} testID="main-tab-bar">
      <View style={styles.pourButtonContainer}>
        <PourButton />
      </View>
      <View style={styles.navContainer}>
        <TabBarButton
          icon={{ name: 'home' }}
          isFocused={state.index === 0}
          onPress={_onTabPress}
          route={state.routes[0]}
        />
        <TabBarButton
          icon={{ name: 'chart-pie', type: 'material-community' }}
          isFocused={state.index === 1}
          onPress={_onTabPress}
          route={state.routes[1]}
        />
        <View style={{ width: 100 }} />
        <TabBarButton
          icon={{ name: 'notifications' }}
          iconContainerComponent={NotificationBadges}
          isFocused={state.index === 2}
          onPress={_onTabPress}
          route={state.routes[2]}
        />
        <TabBarButton
          icon={{ name: 'menu' }}
          iconContainerComponent={FriendRequestBadge}
          isFocused={state.index === 3}
          onPress={_onTabPress}
          route={state.routes[3]}
        />
      </View>
    </View>
  );
};
