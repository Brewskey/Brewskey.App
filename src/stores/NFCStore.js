// @flow

import { action, computed, observable } from 'mobx';

class NFCStore {
  @observable _currentSeconds: number;
  @observable _isVisible: boolean = false;
  _timer: ?IntervalID = null;

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
    this._startTimer();
  };

  @action
  onHideModal = () => {
    this._stopTimer();
    this._isVisible = false;
  };

  _startTimer = () => {
    this._stopTimer();
    const updateTimer = action(
      () => (this._currentSeconds = 30 - new Date().getSeconds() % 30),
    );
    updateTimer();
    this._timer = setInterval(updateTimer, 1000);
  };

  _stopTimer = () => {
    if (!this._timer) {
      return;
    }
    clearInterval(this._timer);
    this._timer = null;
  };
}

export default new NFCStore();
