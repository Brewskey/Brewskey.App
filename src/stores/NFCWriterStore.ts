import { Auth } from '@brewskey/js-api';
import NfcManager, { Ndef } from 'react-native-nfc-manager';

import { CONFIG } from 'config';
import { SnackBarStore } from 'hooks/context/SnackBarContext';

import type { UserCredentials } from '@brewskey/js-api';

type NFCWriterStoreStatus = 'instructions' | 'login' | 'writing';

export class NFCWriterStore {
  isNFCSupported = true;

  status: NFCWriterStoreStatus = 'instructions';

  _token!: string | null;

  constructor() {
    this.status = 'instructions';
    this._resetValues();

    NfcManager.start().catch(() => {
      this.isNFCSupported = false;
    });
  }

  onBeginUserLogin = async (): Promise<void> => {
    this.status = 'login';
    await this._resetValues();
  };

  onAuthenticateUser: (arg1: UserCredentials) => Promise<void> = async (
    userCredentials: UserCredentials,
  ): Promise<void> => {
    const { accessToken } = await Auth.login(userCredentials);

    try {
      // Use token to grab auth for NFC

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
    } catch {
      SnackBarStore.showMessage({
        style: 'danger',
        content: 'There was an error getting your NFC token ready.',
      });
    }

    this._enableNFCWriting();
  };

  onFinished: () => void = () => {
    this._resetValues();
  };

  _enableNFCWriting: () => Promise<void> = async () => {
    this.status = 'writing';

    await NfcManager.registerTagEvent();
    // Artificial wait to allow Android to get ready.
    await new Promise((resolve) => {
      setTimeout(resolve, 300);
    });

    this._requestWriteTag();
  };

  _requestWriteTag: () => Promise<void> = async () => {
    if (this._token == null) {
      return;
    }
    const payload = Ndef.encodeMessage([Ndef.textRecord(this._token)]);

    // First try to format the card
    // console.log('1');
    // const isFormattable = await NfcManager.isSupported('NdefFormatable');
    // console.log('2');

    try {
      await NfcManager.ndefHandler.writeNdefMessage(payload);

      SnackBarStore.showMessage({
        style: 'success',
        content: "You've successfully written to your card.",
      });
    } catch {
      if (this._token == null) {
        return;
      }

      SnackBarStore.showMessage({
        style: 'danger',
        content: "Card didn't write. Try again!",
      });
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    this._requestWriteTag();
  };

  _resetValues = async (): Promise<void> => {
    this._token = null;
    await NfcManager.cancelTechnologyRequest();
    await NfcManager.unregisterTagEvent();
  };
}
