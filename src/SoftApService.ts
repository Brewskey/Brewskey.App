import forge from 'node-forge';

import { fetchJSON } from 'utils';

import type { WifiNetwork } from 'types';

/** Public key wrapper that encrypts with PKCS#1 v1.5 and returns hex (React Native/Expo compatible). */
export interface RsaPublicKeyWrapper {
  encrypt: (plaintext: string) => string;
}

const BASE_URL = 'http://192.168.0.1:80';
const DEFAULT_WIFI_CHANNEL = 3;
const DEFAULT_WIFI_INDEX = 0;
const PUBLIC_KEY_TIMEOUT = 5000;
const INCORRECT_WIFI_PASSWORD_CODE = -4;
const SUCCESS_RESPONSE_CODE = 0;

export const WIFI_SECURITIES = {
  OPEN: 0,
  WEP_PSK: 1,
  WEP_SHARED: 32769,
  WPA2_AES_PSK: 4194308,
  WPA2_MIXED_PSK: 4194310,
  WPA2_TKIP_PSK: 4194306,
  WPA_AES_PSK: 2097156,
  WPA_TKIP_PSK: 2097154,
} as const;

interface WifiResult {
  ch: number;
  sec: number;
  ssid: string;
}

const translateWifiFromApi = ({ ch, sec, ssid }: WifiResult): WifiNetwork => ({
  channel: ch,
  security: sec,
  ssid,
});

const HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

/** node-forge accepts an options object here at runtime; @types/node-forge only lists boolean. */
const asn1FromDerCompat = forge.asn1.fromDer as (
  bytes: string | forge.util.ByteBuffer,
  options?: boolean | { parseAllBytes?: boolean; strict?: boolean },
) => forge.asn1.Asn1;

/**
 * Particle SoftAP returns hex-encoded DER with a vendor prefix and optional suffix.
 * Legacy apps assumed a fixed 22-byte (44 hex char) strip before PKCS#1 DER; firmware may
 * append trailing bytes or vary prefix length. Parse only the first ASN.1 structure so trailing
 * DER does not trigger forge's "Unparsed DER bytes remain after ASN.1 parsing".
 */
function rsaPublicKeyFromSoftApHex(rawHex: string): forge.pki.rsa.PublicKey {
  const normalizedHex = rawHex.replace(/\s+/g, '').toLowerCase();
  if (normalizedHex.length % 2 !== 0) {
    throw new Error('Invalid public key hex length.');
  }

  const stripPrefixesHexChars = [
    44, // 22-byte prefix — historical Particle SoftAP framing
    48,
    52,
    56,
    40,
    36,
    32,
    0,
  ];

  let lastError: unknown;
  for (const stripChars of stripPrefixesHexChars) {
    const derHex =
      stripChars === 0 ? normalizedHex : normalizedHex.slice(stripChars);
    if (derHex.length < 32) {
      continue;
    }
    try {
      const derBytes = forge.util.hexToBytes(derHex);
      const asn1PublicKey = asn1FromDerCompat(derBytes, {
        parseAllBytes: false,
      });
      return forge.pki.publicKeyFromAsn1(asn1PublicKey);
    } catch (e) {
      lastError = e;
    }
  }

  const detail =
    lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Could not parse Brewskey Box RSA public key (${detail}).`);
}

class SoftAPService {
  static configureWifi = async ({
    channel = DEFAULT_WIFI_CHANNEL,
    index = DEFAULT_WIFI_INDEX,
    password,
    security,
    ssid,
  }: WifiNetwork): Promise<void> => {
    const publicKey = await SoftAPService.getPublicKey();
    const encryptedPassword = password ? publicKey.encrypt(password) : '';

    const body = JSON.stringify({
      ch: channel,
      idx: index,
      pwd: encryptedPassword,
      sec: security,
      ssid,
    });

    const { r: responseCode, ..._otherData } = await fetchJSON(
      `${BASE_URL}/configure-ap`,
      {
        body,
        headers: {
          ...HEADERS,
          'Content-Length': body.length.toString(),
        },
        method: 'POST',
      },
    );

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

  static connectWifi = async (networkIndex = 0): Promise<void> => {
    const body = JSON.stringify({ idx: networkIndex });
    const { r: responseCode } = await fetchJSON(`${BASE_URL}/connect-ap`, {
      body,
      headers: {
        ...HEADERS,
        'Content-Length': body.length.toString(),
      },
      method: 'POST',
    });

    if (responseCode !== SUCCESS_RESPONSE_CODE) {
      throw new Error('Error on connecting Brewskey box to wifi network!');
    }
  };

  static getParticleID = async (): Promise<string> => {
    const { id } = await fetchJSON<{ id: string }>(`${BASE_URL}/device-id`);
    return id;
  };

  static scanWifi = async (): Promise<WifiNetwork[]> => {
    const { scans } = await fetchJSON<{ scans: WifiResult[] }>(
      `${BASE_URL}/scan-ap`,
    );
    return scans.map(translateWifiFromApi);
  };

  static getPublicKey = async (): Promise<RsaPublicKeyWrapper> =>
    new Promise((resolve, reject) => {
      const fetchKey = async (): Promise<void> => {
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

        fetchJSON<{
          b: string;
          r: number;
        }>(`${BASE_URL}/public-key`)
          .then(({ b: rawDerPublicKey, r: responseCode }) => {
            if (responseCode !== SUCCESS_RESPONSE_CODE) {
              reject(new Error('Error on getting public Brewskey box key!'));
              return;
            }

            const publicKey = rsaPublicKeyFromSoftApHex(rawDerPublicKey);

            resolve({
              encrypt: (plaintext: string): string => {
                const encrypted = publicKey.encrypt(
                  plaintext,
                  'RSAES-PKCS1-V1_5',
                );
                return forge.util.bytesToHex(encrypted);
              },
            });
          })
          .catch((error) => {
            // eslint-disable-next-line no-console -- user-visible error context
            console.error('Error on getting public Brewskey box key!', error);
            reject(error);
          });
      };
      fetchKey();
    });
}

export { SoftAPService };
