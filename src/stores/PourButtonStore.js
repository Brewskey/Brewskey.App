// @flow

import { action, observable } from 'mobx';

class PourButtonStore {
  @observable isVisible = false;

  @action
  show = () => {
    this.isVisible = true;
  };

  @action
  hide = () => {
    this.isVisible = false;
  };
}

export default new PourButtonStore();
