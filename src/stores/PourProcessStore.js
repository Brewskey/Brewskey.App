// @flow

import type { EntityID } from 'brewskey.js-api';

import { Platform } from 'react-native';
import { action, observable, runInAction } from 'mobx';
import NfcManager from 'react-native-nfc-manager';
import nullthrows from 'nullthrows';
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

  @observable
  currentSeconds: number = 0;
  @observable
  deviceID: ?EntityID = 0;
  @observable
  errorText: string = '';
  @observable
  isLoading: boolean = false;
  @observable
  isNFCEnabled: boolean = false;
  @observable
  isNFCSupported: boolean = true;
  @observable
  isVisible: boolean = false;
  @observable
  totp: string = '';
  @observable
  shouldShowPaymentScreen: boolean = false;
  @observable
  _didAuthorizePayment: boolean = false;
  @observable
  _hasReadTag: boolean = false;

  constructor() {
    NfcManager.start().catch(() => {
      runInAction(() => (this.isNFCSupported = false));
    });
  }

  @action
  setTotp = (totp: string): void => {
    const newTotp = totp.replace(/\D/g, '');

    if (newTotp === this.totp) {
      return;
    }
    this._setErrorText('');
    this.totp = newTotp;
    if (this.totp.length === 6) {
      this.onPourPress();
    }
  };

  @action
  onShowModal = async (): Promise<void> => {
    this._setIsLoading(true);
    // this.shouldShowPaymentScreen = true;
    // this.deviceID = 25;

    let isNFCEnabled = false;

    if (Platform.OS === 'android') {
      isNFCEnabled = await NfcManager.isEnabled();
      runInAction(() => {
        this.isNFCEnabled = isNFCEnabled;
      });
    } else {
      isNFCEnabled = this.isNFCSupported;
    }

    if (isNFCEnabled) {
      NfcManager.registerTagEvent(
        this._onNFCTagDiscovered,
        'Tap Brewskey Box',
        true,
        // {
        //   invalidateAfterFirstRead: true,
        //   isReaderModeEnabled: true,
        //   readerModeFlags: NfcAdapter.FLAG_READER_NFC_A,
        // },
      );
    }

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
  onHideModal = (): void => {
    GPSCoordinatesStore.flushCache();
    if (this.isNFCEnabled) {
      NfcManager.unregisterTagEvent();
    }

    this._stopTotpTimer();
    this.setTotp('');
    this.isVisible = false;
    this.shouldShowPaymentScreen = false;
    this._didAuthorizePayment = false;
    this._hasReadTag = false;
    this.deviceID = null;
  };

  @action
  startPaymentPour = (): void => {
    this._didAuthorizePayment = true;
    this._sendPourAuthorization();
  };

  @action
  _setErrorText = (errorText: string): void => {
    this.errorText = errorText;
  };

  onEnableNFCPress = (): void => {
    this.onHideModal();
    this.isNFCEnabled && NfcManager.goToNfcSetting();
  };

  onPourPress = (): void => {
    this._processPour();
  };

  _processPour = async (): Promise<void> => {
    try {
      this._setIsLoading(true);
      this._setErrorText('');

      // const payload = await this._getAuthPayload();
      // const paymentResult = await fetchJSON(
      //   `${CONFIG.HOST}/api/authorizations/does-require-payment/`,
      //   payload,
      // );

      // if (paymentResult.shouldAskForPayment) {
      //   this._showPayments(paymentResult.deviceID);
      //   return;
      // }

      // this.deviceID = paymentResult.deviceID;
      await this._sendPourAuthorization();
    } catch (error) {
      if (!this.deviceID) {
        this._setErrorText(
          'The passcode you entered was incorrect or expired.  Please try a new code.',
        );
      } else {
        this._setErrorText('An error during processing pour');
      }
    } finally {
      this._setIsLoading(false);
    }
  };

  _sendPourAuthorization = async (): Promise<void> => {
    try {
      this._setIsLoading(true);
      this._setErrorText('');

      const payload = await this._getAuthPayload();

      await fetchJSON(`${CONFIG.HOST}/api/authorizations/pour/`, payload);
      this.setTotp('');
      this.onHideModal();

      SnackBarStore.showMessage({
        duration: 3000,
        style: 'success',
        text: 'You can start pouring now!',
      });
    } catch (error) {
      if (!this.deviceID) {
        this._setErrorText(
          'The passcode you entered was incorrect or expired.  Please try a new code.',
        );
      } else {
        this._setErrorText('An error during processing pour');
      }
    } finally {
      this._setIsLoading(false);
    }
  };

  _getAuthPayload = async (): Promise<{|
    body: string,
    headers: Object,
    method: string,
  |}> => {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${AuthStore.accessToken || ''}`,
      'Content-Type': 'application/json',
    };

    const coordinates = await waitForLoaded(() => GPSCoordinatesStore.get());
    const body = JSON.stringify({
      ...coordinates,
      deviceId: this.deviceID || undefined,
      didAuthorizePayment: this._didAuthorizePayment,
      totp: this.totp,
    });

    return {
      body,
      headers,
      method: 'POST',
    };
  };

  @action
  _setIsLoading = (isLoading: boolean): void => {
    this.isLoading = isLoading;
  };

  @action
  _setIsVisible = (isVisible: boolean): void => {
    this.isVisible = isVisible;
  };

  _onNFCTagDiscovered = (tag: Object): void => {
    if (this._hasReadTag) {
      return;
    }

    this._hasReadTag = true;
    let payload;
    if (tag.ndefMessage) {
      // eslint-disable-next-line prefer-destructuring
      payload = tag.ndefMessage[1].payload;
    } else {
      if (!tag[1].payload[0]) {
        tag[1].payload.shift();
      }

      // eslint-disable-next-line prefer-destructuring
      payload = tag[1].payload;
    }

    const tagValue = String.fromCharCode.apply(
      null,
      payload[0] === 0 ? payload.slice(1) : payload,
    );

    if (tagValue.indexOf(CONFIG.HOST) < 0) {
      return;
    }

    const index = tagValue.indexOf('d/');

    if (index < 0) {
      return;
    }

    const result = nullthrows(tagValue.substring(index).match(/\d+/));
    this.deviceID = result[0];
    this._processPour();
  };

  @action
  _updateTotpTimer = (): void => {
    this.currentSeconds = 30 - (new Date().getSeconds() % 30);
  };

  _startTotpTimer = (): void => {
    this._updateTotpTimer();
    this._totpTimer = setInterval(this._updateTotpTimer, 1000);
  };

  _stopTotpTimer = (): void => {
    if (!this._totpTimer) {
      return;
    }
    clearInterval(this._totpTimer);
    this._totpTimer = null;
  };

  @action
  _showPayments = (deviceID: EntityID): void => {
    this.deviceID = deviceID;
    this.shouldShowPaymentScreen = true;
  };
}

export default new PourProcessStore();
