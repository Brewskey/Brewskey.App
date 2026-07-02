/* eslint-disable no-bitwise, no-await-in-loop -- APDU/NDEF byte packing and
   sequential protocol I/O: each READ BINARY depends on the previous one */
import { useCallback, useEffect, useRef, useState } from 'react';

import { Platform } from 'react-native';

import { getNfcManager } from 'services/nfc';

// NFC Forum Type 4 Tag commands for the applet emulated by the Brewskey Box
// (PN532 firmware, src/PN532/emulatetag.cpp). The tag is read over raw
// ISO-DEP instead of the OS NDEF stack: Android reader mode with
// FLAG_READER_SKIP_NDEF_CHECK avoids the platform's strict Type 4 probing
// (which the PN532's hardware-generated ATS often fails), and on iOS an
// ISO7816 tag session sidesteps NFCNDEFReaderSession's single-read limits.
const SELECT_NDEF_APP = [
  0x00, 0xa4, 0x04, 0x00, 0x07, 0xd2, 0x76, 0x00, 0x00, 0x85, 0x01, 0x01, 0x00,
];
const SELECT_CC_FILE = [0x00, 0xa4, 0x00, 0x0c, 0x02, 0xe1, 0x03];
const SELECT_NDEF_FILE = [0x00, 0xa4, 0x00, 0x0c, 0x02, 0xe1, 0x04];
const CC_LENGTH = 0x0f;
// Matches the MLe the box advertises in its capability container.
const DEFAULT_CHUNK_SIZE = 84;

function readBinary(offset: number, length: number): number[] {
  return [0x00, 0xb0, (offset >> 8) & 0xff, offset & 0xff, length & 0xff];
}

function hasOkStatus(response: number[] | null | undefined): boolean {
  return (
    Array.isArray(response) &&
    response.length >= 2 &&
    response[response.length - 2] === 0x90 &&
    response[response.length - 1] === 0x00
  );
}

function stripStatus(response: number[]): number[] {
  return response.slice(0, response.length - 2);
}

function toHex(bytes: number[]): string {
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join(' ');
}

export interface NfcBoxReadResult {
  uri: string | null;
  rawNdefHex: string;
  durationMs: number;
}

export type NfcBoxReadStatus = 'idle' | 'scanning';

/**
 * Debug/validation hook: reads the NDEF message the Brewskey Box emulates,
 * using app-driven APDUs over ISO-DEP. On Android it keeps scanning until
 * stopped (so repeat taps can be tested); on iOS each start() runs one
 * system NFC session.
 */
export function useNfcBoxRead() {
  const [status, setStatus] = useState<NfcBoxReadStatus>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<NfcBoxReadResult | null>(null);
  const cancelledRef = useRef(false);

  const nfc = getNfcManager();
  const NfcManager = nfc?.default ?? null;
  const isSupported = Boolean(NfcManager);

  const log = useCallback((line: string) => {
    setLogs((prev) => [...prev.slice(-199), line]);
  }, []);

  const cleanupNfc = useCallback(async () => {
    try {
      await NfcManager?.cancelTechnologyRequest?.();
    } catch {
      // ignore
    }
  }, [NfcManager]);

  const readOnce = useCallback(async (): Promise<NfcBoxReadResult> => {
    const { NfcTech, NfcAdapter, Ndef } = nfc ?? {};

    const requestOptions =
      Platform.OS === 'android'
        ? {
            isReaderModeEnabled: true,
            readerModeFlags:
              NfcAdapter.FLAG_READER_NFC_A |
              NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK |
              NfcAdapter.FLAG_READER_NO_PLATFORM_SOUNDS,
            readerModeDelay: 500,
          }
        : {
            alertMessage: 'Hold your phone against the Brewskey Box',
          };

    log('Waiting for the box (ISO-DEP)...');
    await NfcManager.requestTechnology(NfcTech.IsoDep, requestOptions);

    const startedAt = Date.now();
    const elapsed = () => `+${Date.now() - startedAt}ms`;

    const transceive = async (
      label: string,
      apdu: number[],
    ): Promise<number[]> => {
      const response = (await NfcManager.isoDepHandler.transceive(
        apdu,
      )) as number[];
      const ok = hasOkStatus(response);
      log(
        `${elapsed()} ${label} -> ${ok ? 'OK' : `FAIL [${toHex(response)}]`}`,
      );
      if (!ok) {
        throw new Error(`${label} failed: [${toHex(response)}]`);
      }
      return stripStatus(response);
    };

    await transceive('SELECT NDEF app', SELECT_NDEF_APP);
    await transceive('SELECT CC file', SELECT_CC_FILE);
    const cc = await transceive('READ CC', readBinary(0, CC_LENGTH));

    const mle = cc.length >= 5 ? (cc[3] << 8) | cc[4] : 0;
    const chunkSize =
      mle > 0 ? Math.min(mle, DEFAULT_CHUNK_SIZE) : DEFAULT_CHUNK_SIZE;

    await transceive('SELECT NDEF file', SELECT_NDEF_FILE);
    const nlenBytes = await transceive('READ NLEN', readBinary(0, 2));
    const nlen = (nlenBytes[0] << 8) | nlenBytes[1];
    log(`${elapsed()} NDEF length: ${nlen} bytes`);
    if (nlen <= 0) {
      throw new Error('Box reports an empty NDEF message');
    }

    const ndefBytes: number[] = [];
    let offset = 2;
    while (ndefBytes.length < nlen) {
      const remaining = nlen - ndefBytes.length;
      const chunk = await transceive(
        `READ NDEF @${offset}`,
        readBinary(offset, Math.min(remaining, chunkSize)),
      );
      if (chunk.length === 0) {
        throw new Error('Box returned an empty READ BINARY response');
      }
      ndefBytes.push(...chunk);
      offset += chunk.length;
    }

    let uri: string | null = null;
    try {
      const records = Ndef?.decodeMessage?.(ndefBytes) ?? [];
      const uriRecord = records.find(
        (record: { tnf: number; type: number[] | string }) => {
          const type = Array.isArray(record.type)
            ? String.fromCharCode(...record.type)
            : String(record.type);
          return record.tnf === 1 && type === 'U';
        },
      );
      if (uriRecord != null) {
        uri = Ndef.uri.decodePayload(uriRecord.payload);
      }
    } catch {
      // fall through with raw bytes only
    }

    const durationMs = Date.now() - startedAt;
    log(`${elapsed()} Done. URI: ${uri ?? '(no URI record decoded)'}`);
    return { uri, rawNdefHex: toHex(ndefBytes), durationMs };
  }, [nfc, NfcManager, log]);

  const startScan = useCallback(async () => {
    if (!isSupported || status === 'scanning') {
      return;
    }

    cancelledRef.current = false;
    setStatus('scanning');
    setResult(null);
    setLogs([]);

    try {
      await NfcManager.start?.();
    } catch {
      // already started or unavailable; the request below will surface it
    }

    // Android reader mode stays active between taps, so loop to measure
    // repeatability. iOS shows a system sheet per session; run one attempt.
    do {
      try {
        const readResult = await readOnce();
        setResult(readResult);
      } catch (error) {
        log(`Error: ${(error as Error).message}`);
      } finally {
        await cleanupNfc();
      }
    } while (Platform.OS === 'android' && !cancelledRef.current);

    setStatus('idle');
  }, [isSupported, status, NfcManager, readOnce, cleanupNfc, log]);

  const stopScan = useCallback(async () => {
    cancelledRef.current = true;
    await cleanupNfc();
    setStatus('idle');
  }, [cleanupNfc]);

  useEffect(
    () => () => {
      cancelledRef.current = true;
      cleanupNfc();
    },
    [cleanupNfc],
  );

  return { status, logs, result, isSupported, startScan, stopScan };
}
