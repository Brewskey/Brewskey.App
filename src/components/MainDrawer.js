// @flow

import type AppSettingsStore from '../stores/AppSettingsStore';
import type RoutesSettingsStore from '../stores/RoutesSettingsStore';

import * as React from 'react';
import InjectedComponent from '../common/InjectedComponent';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { DrawerItems } from 'react-navigation';
import DrawerHeader from './DrawerHeader';
import LogoutButton from './LogoutButton';

type DrawerItem = {|
  key: string,
  params?: Object,
  routeName: string,
|};

type Props = {|
  items: Array<DrawerItem>,
|};

type InjectedProps = {|
  appSettingsStore: AppSettingsStore,
  routesSettingsStore: RoutesSettingsStore,
|};

@inject('appSettingsStore')
@inject('routesSettingsStore')
@observer
class MainDrawer extends InjectedComponent<InjectedProps, Props> {
  render() {
    const items = this.injectedProps.appSettingsStore.manageTapsEnabled
      ? this.props.items
      : this.props.items.filter((item: DrawerItem): boolean => {
          const routeSettings = this.injectedProps.routesSettingsStore.getRouteSettings(
            item.routeName,
          );
          return routeSettings ? !routeSettings.requireManageTaps : true;
        });

    return (
      <View>
        <DrawerHeader />
        <DrawerItems {...this.props} items={items} />
        <LogoutButton />
      </View>
    );
  }
}

export default MainDrawer;
