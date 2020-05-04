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
  onBeginUserLogin: () => void = (): void => {
    this.status = 'login';
    this._resetValues();
  };

  @action
  onAuthenticateUser: (UserCredentials) => void = async (
    userCredentials: UserCredentials,
  ): void => {
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

      const { token } = await response.json();
      this._token = token;
    } catch (error) {
      SnackBarStore.showMessage({
        style: 'danger',
        text: 'There was an error getting your NFC token ready.',
      });
    }

    this._enableNFCWriting();
  };

  @action
  onFinished: () => void = () => {
    this._resetValues();
  };

  @action
  _enableNFCWriting: () => Promise<void> = async () => {
    this.status = 'writing';

    await NfcManager.registerTagEvent(() => {});
    // Artificial wait to allow Android to get ready.
    await new Promise((resolve) => setTimeout(resolve, 300));

    this._requestWriteTag();
  };

  @action
  _requestWriteTag: () => Promise<void> = async () => {
    const payload = Ndef.encodeMessage([Ndef.textRecord(this._token)]);

    // First try to format the card
    // console.log('1');
    // const isFormattable = await NfcManager.isSupported('NdefFormatable');
    // console.log('2');

    try {
      await NfcManager.requestNdefWrite(payload);

      SnackBarStore.showMessage({
        style: 'success',
        text: "You've successfully written to your card.",
      });
    } catch (error) {
      if (this._token == null) {
        return;
      }

      SnackBarStore.showMessage({
        style: 'danger',
        text: "Card didn't write. Try again!",
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    this._requestWriteTag();
  };

  @action
  _resetValues: () => void = () => {
    this._token = null;
    NfcManager.cancelNdefWrite();
    NfcManager.unregisterTagEvent();
  };
}

export default NFCWriterStore;
