// @flow

import type AppSettingsStore from '../stores/AppSettingsStore';
import type RoutesSettingsStore from '../stores/RoutesSettingsStore';

import * as React from 'react';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react';
import { DrawerItems } from 'react-navigation';
import LogoutButton from './LogoutButton';

type DrawerItem = {|
  key: string,
  params?: Object,
  routeName: string,
|};

type Props = {|
  appSettingsStore: AppSettingsStore,
  routesSettingsStore: RoutesSettingsStore,
|};

@inject('appSettingsStore')
@inject('routesSettingsStore')
@observer
class MainDrawer extends React.Component<Props> {
  render(): React.Element<*> {
    const items = this.props.appSettingsStore.manageTapsEnabled
      ? this.props.items
      : this.props.items.filter((item: DrawerItem): boolean => {
          const routeSettings = this.props.routesSettingsStore.getRouteSettings(
            item.routeName,
          );
          return routeSettings ? !routeSettings.requireManageTaps : true;
        });

    return (
      <View>
        <DrawerItems {...this.props} items={items} />
        <LogoutButton />
      </View>
    );
  }
}

export default MainDrawer;
