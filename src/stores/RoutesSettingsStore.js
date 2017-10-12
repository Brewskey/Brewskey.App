// @flow

import type RootStore from './RootStore';

import { action, observable } from 'mobx';

export type RouteSettings = {|
  requireManageTaps?: boolean,
|};

class RoutesSettingsStore {
  _rootStore: RootStore;
  @observable _settingsByRouteName: Map<string, RouteSettings> = new Map();

  constructor(rootStore: RootStore) {
    this._rootStore = rootStore;
  }

  @action
  updateRouteSettings = (routeName: string, settings: Object) => {
    const existingSettings = this._settingsByRouteName.get(routeName);

    this._settingsByRouteName.set(routeName, {
      ...(existingSettings || {}),
      ...settings,
    });
  };

  getRouteSettings = (routeName: string): ?RouteSettings => {
    return this._settingsByRouteName.get(routeName);
  };
}

export default RoutesSettingsStore;
