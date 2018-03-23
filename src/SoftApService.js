// @flow

import type { WifiNetwork } from './types';

import { fetchJSON } from './utils';
import NodeRSA from 'node-rsa';

const BASE_URL = 'http://192.168.0.1:80';
const SUCCESS_RESPONSE_CODE = 0;
const DEFAULT_WIFI_INDEX = 0;
const DEFAULT_WIFI_CHANNEL = 3;

/* eslint-disable sorting/sort-object-props */
export const WIFI_SECURITIES = {
  OPEN: 0,
  WEP_PSK: 1,
  WEP_SHARED: 32769,
  WPA_AES_PSK: 2097156,
  WPA_TKIP_PSK: 2097154,
  WPA2_AES_PSK: 4194308,
  WPA2_MIXED_PSK: 4194310,
  WPA2_TKIP_PSK: 4194306,
};
/* eslint-enable */

const translateWifiFromApi = ({
  ch,
  mdr,
  rssi,
  sec,
  ssid,
}: Object): WifiNetwork => ({
  channel: ch,
  mdr,
  rssi,
  security: sec,
  ssid,
});

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

    const { r: responseCode } = await fetchJSON({
      body: {
        ch: channel,
        idx: index,
        pwd: encryptedPassword,
        sec: security,
        'ssid-value': ssid,
      },
      method: 'POST',
      url: `${BASE_URL}/configure-ap`,
    });

    if (responseCode !== SUCCESS_RESPONSE_CODE) {
      throw new Error('error on configure wifi on Brewskey box!');
    }
  };

  static connectWifi = async (networkIndex?: number = 0): Promise<void> => {
    const { r: responseCode } = await fetchJSON({
      body: { idx: networkIndex },
      method: 'POST',
      url: `${BASE_URL}/connect-ap`,
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

  static _getPublicKey = async (): Promise<Object> => {
    const { b: rawDerPublicKey, r: responseCode } = await fetchJSON(
      `${BASE_URL}/public-key`,
    );

    if (responseCode !== SUCCESS_RESPONSE_CODE) {
      throw new Error('Error on getting public Brewskey box key!');
    }

    const derBuffer = Buffer.from(rawDerPublicKey, 'hex');
    const publicKey = new NodeRSA(derBuffer.slice(22), 'pkcs1-public-der', {
      encryptionScheme: 'pkcs1',
    });

    return publicKey;
  };
}

export default SoftAPService;
