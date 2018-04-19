// @flow

import { action, computed, observable } from 'mobx';

export type SnackBarMessage = {
  duration: number,
  style?: 'danger' | 'default' | 'success',
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
  showMessage = ({
    duration = 2000,
    style = 'default',
    ...rest
  }: {
    ...SnackBarMessage,
    duration?: number,
  }) => {
    this._messages.push({ duration, style, ...rest });
  };
}

export default new SnackBarStore();
