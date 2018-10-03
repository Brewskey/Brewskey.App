// @flow

import type { Node } from 'react';
import type { Notification } from './NotificationsStore';

import { action, computed, observable } from 'mobx';
import nullthrows from 'nullthrows';

type TextStyleType = 'danger' | 'default' | 'success';

type SnackBarMessageParameters =
  | {|
      duration?: number,
      position?: 'bottom' | 'top',
      style?: TextStyleType,
      text: string,
    |}
  | {|
      content: Node,
      duration?: number,
      position?: 'bottom' | 'top',
    |}
  | {|
      duration?: number,
      notification: Notification,
      position?: 'bottom' | 'top',
    |};
export type SnackBarMessage =
  | {|
      duration: number,
      position: 'bottom' | 'top',
      style: TextStyleType,
      text: string,
    |}
  | {|
      content: Node,
      duration: number,
      position: 'bottom' | 'top',
    |}
  | {|
      duration: number,
      notification: Notification,
      position: 'bottom' | 'top',
    |};

class SnackBarStore {
  @observable
  _messages: Array<SnackBarMessage> = [];

  @computed
  get currentMessage(): ?SnackBarMessage {
    return this._messages.length ? this._messages[0] : null;
  }

  @action
  dropCurrentMessage = () => {
    this._messages.shift();
  };

  @action
  showMessage = (messageParameters: SnackBarMessageParameters) => {
    let mergedParameters = null;

    if (messageParameters.text) {
      mergedParameters = {
        duration: 2000,
        position: 'bottom',
        style: 'default',
        ...messageParameters,
      };
    } else if (messageParameters.content) {
      mergedParameters = {
        duration: 2000,
        position: 'bottom',
        ...messageParameters,
      };
    } else if (messageParameters.notification) {
      mergedParameters = {
        duration: 2000,
        position: 'bottom',
        ...messageParameters,
      };
    }

    this._messages.push(nullthrows(mergedParameters));
  };
}

export default new SnackBarStore();
