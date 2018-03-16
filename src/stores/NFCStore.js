// @flow

import { action, computed, observable } from 'mobx';
import NfcManager from 'react-native-nfc-manager';

class NFCStore {
  @observable _currentSeconds: number;
  @observable _isVisible: boolean = false;
  _timer: ?IntervalID = null;

  constructor() {
    NfcManager.start();
  }

  @computed
  get currentSeconds(): number {
    return this._currentSeconds;
  }

  @computed
  get isVisible(): boolean {
    return this._isVisible;
  }

  @action
  onShowModal = () => {
    this._isVisible = true;
    this._startNFC();
  };

  @action
  onHideModal = () => {
    this._stopNFC();
    this._isVisible = false;
  };

  _onTagDiscovered = () => {};

  _startNFC = () => {
    this._stopNFC();
    const updateTimer = action(
      () => (this._currentSeconds = 30 - new Date().getSeconds() % 30),
    );
    updateTimer();
    this._timer = setInterval(updateTimer, 1000);

    NfcManager.registerTagEvent(this._onTagDiscovered);
  };

  _stopNFC = () => {
    NfcManager.unregisterTagEvent();

    if (!this._timer) {
      return;
    }
    clearInterval(this._timer);
    this._timer = null;
  };
}

export default new NFCStore();
