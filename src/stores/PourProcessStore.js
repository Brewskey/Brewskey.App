// @flow

import type { EntityID } from 'brewskey.js-api';

import { action, observable, runInAction } from 'mobx';
import NfcManager from 'react-native-nfc-manager';
import AuthStore from './AuthStore';
import { createGPSCoordinatesStore } from '../stores/ApiRequestStores/GPSApiStores';
import { waitForLoaded } from '../stores/DAOStores';
import { fetchJSON } from '../utils';
import SnackBarStore from './SnackBarStore';
import CONFIG from '../config';

// used this instead main singelton for its own cache;
const GPSCoordinatesStore = createGPSCoordinatesStore();

class PourProcessStore {
  _totpTimer: ?IntervalID = null;

  @observable isNFCSupported: boolean = true;
  @observable isNFCEnabled: boolean = false;
  @observable currentSeconds: number = 0;
  @observable isVisible: boolean = false;
  @observable totp: string = '';
  @observable isLoading: boolean = false;

  constructor() {
    NfcManager.start().catch(() =>
      runInAction(() => (this.isNFCSupported = false)),
    );
  }

  @action
  setTotp = (totp: string) => {
    const newTotp = totp.replace(/\D/g, '');

    if (newTotp === this.totp) {
      return;
    }

    this.totp = newTotp;
    if (this.totp.length === 6) {
      this.onPourPress();
    }
  };

  @action
  onShowModal = async () => {
    this._setIsLoading(true);

    const isNFCEnabled = await NfcManager.isEnabled();
    runInAction(() => {
      this.isNFCEnabled = isNFCEnabled;
    });
    isNFCEnabled && NfcManager.registerTagEvent(this._onNFCTagDiscovered);

    this._startTotpTimer();

    try {
      await waitForLoaded(() => GPSCoordinatesStore.get());
      runInAction(() => {
        this.isVisible = true;
      });
    } catch (error) {
      SnackBarStore.showMessage({
        duration: 3000,
        style: 'danger',
        text: "Can't get your GPS coordinates",
      });
      GPSCoordinatesStore.flushCache();
    }

    this._setIsLoading(false);
  };

  @action
  onHideModal = () => {
    GPSCoordinatesStore.flushCache();
    NfcManager.unregisterTagEvent();
    this._stopTotpTimer();
    this.isVisible = false;
  };

  onEnableNFCPress = () => {
    this.onHideModal();
    NfcManager.goToNfcSetting();
  };

  onPourPress = () => {
    this._processPour();
  };

  _processPour = async (deviceID?: EntityID) => {
    try {
      this._setIsLoading(true);
      const coordinates = await waitForLoaded(() => GPSCoordinatesStore.get());

      await fetchJSON(`${CONFIG.HOST}/api/authorizations/pour`, {
        body: JSON.stringify({
          ...coordinates,
          deviceId: deviceID || undefined,
          totp: this.totp,
        }),
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${AuthStore.token || ''}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      this.setTotp('');
      this.onHideModal();

      SnackBarStore.showMessage({
        duration: 3000,
        style: 'success',
        text: 'You can start pouring now!',
      });
    } catch (error) {
      if (!deviceID) {
        SnackBarStore.showMessage({
          duration: 3000,
          style: 'danger',
          text:
            'The passcode you entered was incorrect or expired.  Please try a new code.',
        });
      } else {
        SnackBarStore.showMessage({
          duration: 3000,
          style: 'danger',
          text: 'An error during processing pour',
        });
      }
    } finally {
      this._setIsLoading(false);
    }
  };

  @action
  _setIsLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };

  @action
  _setIsVisible = (isVisible: boolean) => {
    this.isVisible = isVisible;
  };

  _onNFCTagDiscovered = () => {
    // todo parse NFC message;
    const deviceID = '123';
    this._processPour(deviceID);
  };

  @action
  _updateTotpTimer = () => {
    this.currentSeconds = 30 - new Date().getSeconds() % 30;
  };

  _startTotpTimer = () => {
    this._updateTotpTimer();
    this._totpTimer = setInterval(this._updateTotpTimer, 1000);
  };

  _stopTotpTimer = () => {
    if (!this._totpTimer) {
      return;
    }
    clearInterval(this._totpTimer);
    this._totpTimer = null;
  };
}

export default new PourProcessStore();
