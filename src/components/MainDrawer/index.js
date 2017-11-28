// @flow

import type AppSettingsStore from '../../stores/AppSettingsStore';
import type { DrawerRoute } from './drawerRoutes';

import * as React from 'react';
import InjectedComponent from '../../common/InjectedComponent';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react';
import { COLORS } from '../../theme';
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

type InjectedProps = {|
  appSettingsStore: AppSettingsStore,
|};

@inject('appSettingsStore')
@observer
class MainDrawer extends InjectedComponent<InjectedProps, Props> {
  render() {
    const { isManageTapsEnabled } = this.injectedProps.appSettingsStore;

    const routes = isManageTapsEnabled
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
