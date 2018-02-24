// @flow

import { action, observable } from 'mobx';

class ToggleStore {
  @observable isToggled: boolean = false;

  @action
  toggleOn = () => {
    this.isToggled = true;
  };

  @action
  toggleOff = () => {
    this.isToggled = false;
  };

  @action
  toggle = () => {
    this.isToggled = !this.isToggled;
  };
}

export default ToggleStore;
