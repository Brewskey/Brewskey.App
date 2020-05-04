// @flow

import { action, observable } from 'mobx';

class ToggleStore {
  @observable isToggled: boolean = false;

  @action
  toggleOn: () => void = (): void => {
    this.isToggled = true;
  };

  @action
  toggleOff: () => void = (): void => {
    this.isToggled = false;
  };

  @action
  toggle: () => void = (): void => {
    this.isToggled = !this.isToggled;
  };
}

export default ToggleStore;
