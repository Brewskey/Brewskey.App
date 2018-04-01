// @flow

import { action, computed, observable } from 'mobx';

export type SnackBarMessage = {
  duration?: number,
  text: string,
};

class SnackBarStore {
  @observable _messages: Array<SnackBarMessage> = [];

  @computed
  get currentMessage(): ?SnackBarMessage {
    return this._messages.length ? this._messages[0] : null;
  }

  @action
  dropCurrentMessage = () => {
    this._messages.shift();
  };

  @action
  showMessage = ({ duration = 2000, ...rest }: SnackBarMessage) => {
    this._messages.push({ duration, ...rest });
  };
}

export default new SnackBarStore();
