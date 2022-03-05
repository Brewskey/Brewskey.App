// @flow

import type { WifiNetwork } from './types';

import { fetchJSON } from './utils';
import NodeRSA from 'node-rsa';

const BASE_URL = 'http://192.168.0.1:80';
const DEFAULT_WIFI_CHANNEL = 3;
const DEFAULT_WIFI_INDEX = 0;
const PUBLIC_KEY_TIMEOUT = 5000;
const INCORRECT_WIFI_PASSWORD_CODE = -4;
const SUCCESS_RESPONSE_CODE = 0;

/* eslint-disable sorting/sort-object-props */
export const WIFI_SECURITIES = {
  OPEN: 0,
  WEP_PSK: 1,
  WEP_SHARED: 32769,
  WPA2_AES_PSK: 4194308,
  WPA2_MIXED_PSK: 4194310,
  WPA2_TKIP_PSK: 4194306,
  WPA_AES_PSK: 2097156,
  WPA_TKIP_PSK: 2097154,
};
/* eslint-enable */

const translateWifiFromApi = ({ ch, sec, ssid }: Object): WifiNetwork => ({
  channel: ch,
  security: sec,
  ssid,
});

const HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

class SoftAPService {
  static configureWifi = async ({
    channel = DEFAULT_WIFI_CHANNEL,
    index = DEFAULT_WIFI_INDEX,
    password,
    security,
    ssid,
  }: WifiNetwork): Promise<void> => {
    const publicKey = await SoftAPService._getPublicKey();
    const encryptedPassword = password
      ? publicKey.encrypt(password, 'hex')
      : '';

    const body = JSON.stringify({
      ch: channel,
      idx: index,
      pwd: encryptedPassword,
      sec: security,
      ssid,
    });

    const { r: responseCode, ...otherData } = await fetchJSON(`${BASE_URL}/configure-ap`, {
      body,
      headers: {
        ...HEADERS,
        'Content-Length': body.length,
      },
      method: 'POST',
    });

    console.log('Configure Wifi', responseCode, otherData)

    if (responseCode === INCORRECT_WIFI_PASSWORD_CODE) {
      throw new Error('Incorrect Wifi password!');
    }

    if (responseCode !== SUCCESS_RESPONSE_CODE) {
      throw new Error(
        'Error on wifi network configuration for Brewskey Box! ' +
          'Please, try again.',
      );
    }
  };

  static connectWifi = async (networkIndex?: number = 0): Promise<void> => {
    const body = JSON.stringify({ idx: networkIndex });
    const { r: responseCode } = await fetchJSON(`${BASE_URL}/connect-ap`, {
      body,
      headers: {
        ...HEADERS,
        'Content-Length': body.length,
      },
      method: 'POST',
    });

    if (responseCode !== SUCCESS_RESPONSE_CODE) {
      throw new Error('Error on connecting Brewskey box to wifi network!');
    }
  };

  static getParticleID = async (): Promise<string> => {
    const { id } = await fetchJSON(`${BASE_URL}/device-id`);
    return id;
  };

  static scanWifi = async (): Promise<Array<WifiNetwork>> => {
    const { scans } = await fetchJSON(`${BASE_URL}/scan-ap`);
    return scans.map(translateWifiFromApi);
  };

  static _getPublicKey = async (): Promise<NodeRSA> =>
    new Promise(async (resolve, reject) => {
      setTimeout(
        () =>
          reject(
            new Error(
              "Can't get public key from Brewskey Box." +
                'Please repeat the whole setup from the beginning.',
            ),
          ),
        PUBLIC_KEY_TIMEOUT,
      );

      const { b: rawDerPublicKey, r: responseCode } = await fetchJSON(
        `${BASE_URL}/public-key`,
      );

      if (responseCode !== SUCCESS_RESPONSE_CODE) {
        reject(new Error('Error on getting public Brewskey box key!'));
      }

      const derBuffer = Buffer.from(rawDerPublicKey, 'hex');
      const publicKey = new NodeRSA(derBuffer.slice(22), 'pkcs1-public-der', {
        encryptionScheme: 'pkcs1',
      });

      resolve(publicKey);
    });
}

export default SoftAPService;
