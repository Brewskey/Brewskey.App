// @flow
import { observable } from 'mobx';

class TabBarStore {
  @observable
  isTabBarVisible: boolean = true;
}

export default new TabBarStore();
