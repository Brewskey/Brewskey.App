// @flow

import type { DrawerRoute } from './drawerRoutes';

import * as React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { COLORS } from '../../theme';
import AppSettingsStore from '../../stores/AppSettingsStore';
import NavigationDrawerButton from './NavigationDrawerButton';
import DrawerHeader from './DrawerHeader';
import DrawerSeperator from './DrawerSeparator';
import LogoutDrawerButton from './LogoutDrawerButton';
import DRAWER_ROUTES from './drawerRoutes';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    flex: 1,
  },
});

type Props = {|
  activeItemKey: string,
|};

@observer
class MainDrawer extends React.Component<Props> {
  render() {
    const routes = AppSettingsStore.isManageTapsEnabled
      ? DRAWER_ROUTES
      : DRAWER_ROUTES.filter(
          ({ isManageTapsRequired }: DrawerRoute): boolean =>
            !isManageTapsRequired,
        );

    return (
      <SafeAreaView
        forceInset={{ horizontal: 'never', top: 'always' }}
        style={styles.container}
      >
        <DrawerHeader />
        <ScrollView>
          {routes.map(({ icon, routeKey, title }: DrawerRoute) => (
            <NavigationDrawerButton
              icon={icon}
              isActive={this.props.activeItemKey === routeKey}
              key={routeKey}
              routeKey={routeKey}
              title={title}
            />
          ))}
          <DrawerSeperator />
          <LogoutDrawerButton />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default MainDrawer;
