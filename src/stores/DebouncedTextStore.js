// @flow

import { action, observable } from 'mobx';
import debounce from 'lodash.debounce';

const DEFAULT_DEBOUNCE_TIMEOUT = 1000;

class DebouncedTextStore {
  _setDebouncedText: (text: string) => void;

  @observable text: string = '';
  @observable debouncedText: string = '';

  constructor(debounceTimeout: number = DEFAULT_DEBOUNCE_TIMEOUT) {
    this._setDebouncedText = debounce(
      action((text: string) => {
        this.debouncedText = text;
      }),
      debounceTimeout,
    );
  }

  @action
  setText = (text: string) => {
    this.text = text;
    this._setDebouncedText(text);
  };
}

export default DebouncedTextStore;
