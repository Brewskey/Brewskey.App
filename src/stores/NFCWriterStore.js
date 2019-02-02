// @flow

import NfcManager, { Ndef } from 'react-native-nfc-manager';
import { action, observable, runInAction } from 'mobx';
import DAOApi from 'brewskey.js-api';
import CONFIG from '../config';
import SnackBarStore from './SnackBarStore';

type NFCWriterStoreStatus = 'instructions' | 'login' | 'writing';

class NFCWriterStore {
  @observable
  isNFCSupported: boolean = true;
  @observable
  userName: string;
  @observable
  password: string;
  @observable
  status: NFCWriterStoreStatus = 'instructions';
  @observable
  _token: string = null;

  constructor() {
    this.status = 'instructions';
    this._resetValues();

    NfcManager.start().catch(() => {
      runInAction(() => (this.isNFCSupported = false));
    });
  }

  @action
  onBeginUserLogin() {
    this.status = 'login';
    this._resetValues();
  }

  @action
  async onAuthenticateUser() {
    let accessToken = null;
    try {
      ({ accessToken } = await DAOApi.Auth.login({
        password: this.password,
        userName: this.userName,
      }));
    } catch (error) {
      // form errors
    }

    try {
      // Use token to grab auth for NFC
      // eslint-disable-next-line no-undef
      const response = await fetch(
        `${CONFIG.HOST}/api/authorizations/nfc-tag/`,
        {
          body: JSON.stringify({ expiresDate: null, useAnonymous: false }),
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
        },
      );

      this._token = await response.text();
    } catch (error) {
      SnackBarStore.showMessage({
        style: 'danger',
        text: 'There was an error getting your NFC token ready.',
      });
    }

    this._enableNFCWriting();
  }

  @action
  onFinished() {
    this._resetValues();
  }

  @action
  async _enableNFCWriting() {
    this.status = 'writing';

    await NfcManager.registerTagEvent(this._onTagDiscovered);
  }

  @action
  async _onTagDiscovered() {
    const payload = Ndef.encodeMessage([Ndef.textRecord(this._token)]);

    await NfcManager.writeNdefMessage(payload);
  }

  @action
  _resetValues() {
    this._token = null;
    this.userName = null;
    this.password = null;
    NfcManager.unregisterTagEvent();
  }
}

export default NFCWriterStore;
