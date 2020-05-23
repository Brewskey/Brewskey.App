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
      type: 'text',
    |}
  | {|
      content: Node,
      duration: number,
      position: 'bottom' | 'top',
      type: 'content',
    |}
  | {|
      duration: number,
      notification: Notification,
      position: 'bottom' | 'top',
      type: 'notification',
    |};

class SnackBarStore {
  @observable
  _messages: Array<SnackBarMessage> = [];

  @computed
  get currentMessage(): ?SnackBarMessage {
    return this._messages.length ? this._messages[0] : null;
  }

  @action
  dropCurrentMessage: () => void = (): void => {
    this._messages.shift();
  };

  @action
  showMessage: (SnackBarMessageParameters) => void = (
    messageParameters: SnackBarMessageParameters,
  ): void => {
    if (messageParameters.text) {
      this._messages.push({
        duration: 2000,
        position: 'bottom',
        style: 'default',
        type: 'text',
        ...messageParameters,
      });
    } else if (messageParameters.content != null) {
      this._messages.push({
        content: messageParameters.content,
        duration: 2000,
        position: 'top',
        type: 'content',
      });
    } else if (messageParameters.notification != null) {
      this._messages.push({
        duration: 2000,
        notification: messageParameters.notification,
        position: 'top',
        type: 'notification',
      });
    }
  };
}

export default new SnackBarStore();
