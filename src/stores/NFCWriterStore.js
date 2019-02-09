// @flow

import type { UserCredentials } from 'brewskey.js-api';

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
  status: NFCWriterStoreStatus = 'instructions';
  @observable
  _token: ?string = null;

  constructor() {
    this.status = 'instructions';
    this._resetValues();

    NfcManager.start().catch(() => {
      runInAction(() => (this.isNFCSupported = false));
    });
  }

  @action
  onBeginUserLogin = () => {
    this.status = 'login';
    this._resetValues();
  };

  @action
  onAuthenticateUser = async (userCredentials: UserCredentials) => {
    const { accessToken } = await DAOApi.Auth.login(userCredentials);

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
      this._token = this._token.replace(/"/g, '');
    } catch (error) {
      SnackBarStore.showMessage({
        style: 'danger',
        text: 'There was an error getting your NFC token ready.',
      });
    }

    this._enableNFCWriting();
  };

  @action
  onFinished = () => {
    this._resetValues();
  };

  @action
  _enableNFCWriting = async () => {
    this.status = 'writing';

    await NfcManager.registerTagEvent(this._onTagDiscovered);
  };

  @action
  _onTagDiscovered = async () => {
    const payload = Ndef.encodeMessage([Ndef.textRecord(this._token)]);

    await NfcManager.requestNdefWrite(payload);

    SnackBarStore.showMessage({
      style: 'success',
      text: "You've successfully written to your card.",
    });
  };

  @action
  _resetValues = () => {
    this._token = null;
    NfcManager.cancelNdefWrite();
    NfcManager.unregisterTagEvent();
  };
}

export default NFCWriterStore;
