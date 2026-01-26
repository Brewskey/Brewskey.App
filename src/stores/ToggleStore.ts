class ToggleStore {
  isToggled = false;

  toggleOn: () => void = (): void => {
    this.isToggled = true;
  };

  toggleOff: () => void = (): void => {
    this.isToggled = false;
  };

  toggle: () => void = (): void => {
    this.isToggled = !this.isToggled;
  };
}

export default ToggleStore;
