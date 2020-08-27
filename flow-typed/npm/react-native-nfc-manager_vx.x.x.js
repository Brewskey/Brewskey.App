// flow-typed signature: 9d1e84063ed654875378b0ab669c719f
// flow-typed version: <<STUB>>/react-native-nfc-manager_vhttps://github.com/whitedogg13/react-native-nfc-manager/flow_v0.125.1

/**
 * This is an autogenerated libdef stub for:
 *
 *   'react-native-nfc-manager'
 *
 * Fill this stub out by replacing all the `any` types.
 *
 * Once filled out, we encourage you to share your work with the
 * community by sending a pull request to:
 * https://github.com/flowtype/flow-typed
 */

declare module 'react-native-nfc-manager' {
  declare type NfcEventsType =
    | 'NfcManagerDiscoverTag'
    | 'NfcManagerSessionClosed'
    | 'NfcManagerStateChanged';
  declare export var NfcEvents: {
    DiscoverTag: 'NfcManagerDiscoverTag',
    SessionClosed: 'NfcManagerSessionClosed',
    StateChanged: 'NfcManagerStateChanged',
  };

  declare type OnDiscoverTag = (evt: TagEvent) => void;
  declare type OnSessionClosed = (evt: {}) => void;
  declare type OnStateChanged = (evt: { state: string }) => void;
  declare type OnNfcEvents = OnDiscoverTag | OnSessionClosed | OnStateChanged;

  declare type NfcTechType =
    | 'Ndef'
    | 'NfcA'
    | 'NfcB'
    | 'NfcF'
    | 'NfcV'
    | 'IsoDep'
    | 'MifareClassic'
    | 'MifareUltralight'
    | 'mifare'
    | 'iso15693'
    | 'felica';
  declare export var NfcTech: {
    Ndef: 'Ndef',
    NfcA: 'NfcA',
    NfcB: 'NfcB',
    NfcF: 'NfcF',
    NfcV: 'NfcV',
    IsoDep: 'IsoDep',
    MifareClassic: 'MifareClassic',
    MifareUltralight: 'MifareUltralight',
    MifareIOS: 'mifare',
    Iso15693IOS: 'iso15693',
    FelicaIOS: 'felica',
  };

  /** [iOS ONLY] */
  declare export var Nfc15693RequestFlagIOS: {
    DualSubCarriers: 1,
    HighDataRate: 2,
    ProtocolExtension: 8,
    Select: 16,
    Address: 32,
    Option: 64,
  };

  /** [ANDROID ONLY] */
  declare export var NfcAdapter: {
    FLAG_READER_NFC_A: 0x1,
    FLAG_READER_NFC_B: 0x2,
    FLAG_READER_NFC_F: 0x4,
    FLAG_READER_NFC_V: 0x8,
    FLAG_READER_NFC_BARCODE: 0x10,
    FLAG_READER_SKIP_NDEF_CHECK: 0x80,
    FLAG_READER_NO_PLATFORM_SOUNDS: 0x100,
  };

  declare export type NdefRecord = {
    id?: Array<number>,
    tnf: number,
    type: Array<number>,
    payload: Array<any>,
  };

  declare export type TagEvent = {
    ndefMessage: NdefRecord[],
    maxSize?: number,
    type?: string,
    techTypes?: string[],
    id?: number[],
  };

  declare type RegisterTagEventOpts = {
    alertMessage?: string,
    invalidateAfterFirstRead?: boolean,
    isReaderModeEnabled?: boolean,
    readerModeFlags?: number,
  };

  declare type NdefWriteOpts = {
    format?: boolean,
    formatReadOnly?: boolean,
  };

  declare type APDU = {
    cla: number,
    ins: number,
    p1: number,
    p2: number,
    data: number[],
    le: number,
  };

  /** [iOS ONLY] */
  declare class Iso15693HandlerIOS {
    getSystemInfo: (
      requestFloags: number,
    ) => Promise<{
      dsfid: number,
      afi: number,
      blockSize: number,
      blockCount: number,
      icReference: number,
    }>;
    readSingleBlock: (params: {
      flags: number,
      blockNumber: number,
    }) => Promise<number[]>;
    writeSingleBlock: (params: {
      flags: number,
      blockNumber: number,
      dataBlock: number[],
    }) => Promise<void>;
    lockBlock: (params: {
      flags: number,
      blockNumber: number,
    }) => Promise<void>;
    writeAFI: (params: { flags: number, afi: number }) => Promise<void>;
    lockAFI: (params: { flags: number }) => Promise<void>;
    writeDSFID: (params: { flags: number, dsfid: number }) => Promise<void>;
    lockDSFID: (params: { flags: number }) => Promise<void>;
    resetToReady: (params: { flags: number }) => Promise<void>;
    select: (params: { flags: number }) => Promise<void>;
    stayQuite: () => Promise<void>;
    customCommand: (params: {
      flags: number,
      customCommandCode: number,
      customRequestParameters: number[],
    }) => Promise<number[]>;
    extendedReadSingleBlock: (params: {
      flags: number,
      blockNumber: number,
    }) => Promise<number[]>;
    extendedWriteSingleBlock: (params: {
      flags: number,
      blockNumber: number,
      dataBlock: number[],
    }) => Promise<void>;
    extendedLockBlock: (params: {
      flags: number,
      blockNumber: number,
    }) => Promise<void>;
  }

  declare export default class NfcManager {
    static start(): Promise<void>;

    static isSupported(): Promise<boolean>;

    static registerTagEvent(options?: RegisterTagEventOpts): Promise<void>;

    static unregisterTagEvent(): Promise<void>;

    static setEventListener(
      name: NfcEventsType,
      callback: OnNfcEvents | null,
    ): void;

    static requestTechnology: (
      tech: NfcTechType,
      options: Object,
    ) => Promise<NfcTechType>;

    static cancelTechnologyRequest: () => Promise<void>;

    static getTag: () => Promise<any>;

    static writeNdefMessage: (bytes: number[]) => Promise<void>;

    static getNdefMessage: () => Promise<TagEvent | null>;

    /** [iOS ONLY] */
    static setAlertMessageIOS: (alertMessage: string) => Promise<void>;
    /** [iOS ONLY] */
    static invalidateSessionIOS: () => Promise<void>;
    /** [iOS ONLY] */
    static invalidateSessionWithErrorIOS: (
      errorMessage: string,
    ) => Promise<void>;
    /** [iOS ONLY] */
    static sendMifareCommandIOS: (bytes: number[]) => Promise<number[]>;
    /** [iOS ONLY] */
    static sendFelicaCommandIOS: (bytes: number[]) => Promise<number[]>;
    /** [iOS ONLY] */
    static sendCommandAPDUIOS: (
      bytesOrApdu: number[] | APDU,
    ) => Promise<{ response: number[], sw1: number, sw2: number }>;
    /** [iOS ONLY] */
    static getIso15693HandlerIOS: () => Iso15693HandlerIOS;

    /** [ANDROID ONLY] */
    static isEnabled(): Promise<boolean>;
    /** [ANDROID ONLY] */
    static goToNfcSetting(): Promise<any>;
    /** [ANDROID ONLY] */
    static getLaunchTagEvent(): Promise<TagEvent | null>;
    /** [ANDROID ONLY] */
    static requestNdefWrite(
      bytes: number[] | Uint8Array,
      opts?: NdefWriteOpts,
    ): Promise<any>;
    /** [ANDROID ONLY] */
    static cancelNdefWrite(): Promise<any>;
    /** [ANDROID ONLY] */
    static getCachedNdefMessageAndroid: () => Promise<TagEvent | null>;
    /** [ANDROID ONLY] */
    static makeReadOnlyAndroid: () => Promise<boolean>;
    /** [ANDROID ONLY] */
    static transceive(bytes: number[]): Promise<number[]>;
    /** [ANDROID ONLY] */
    static getMaxTransceiveLength(): Promise<number>;
    /** [ANDROID ONLY] */
    static mifareClassicSectorToBlock: (
      sector: number,
    ) => Promise<ArrayLike<number>>;
    /** [ANDROID ONLY] */
    static mifareClassicReadBlock: (
      block: ArrayLike<number>,
    ) => Promise<ArrayLike<number>>;
    /** [ANDROID ONLY] */
    static mifareClassicWriteBlock: (
      block: ArrayLike<number>,
      simpliArr: any[],
    ) => Promise<void>;
    /** [ANDROID ONLY] */
    static mifareClassicGetSectorCount: () => Promise<number>;
    /** [ANDROID ONLY] */
    static mifareClassicAuthenticateA: (
      sector: number,
      keys: number[],
    ) => Promise<void>;
  }

  declare export var NdefParser: {
    parseUri(ndef: NdefRecord): { uri: string },
    parseText(ndef: NdefRecord): string | null,
  };

  declare type ISOLangCode = 'en' | string;
  declare type URI = string;

  declare export type WifiSimpleCredentials = {
    ssid: string,
    networkKey: string,
    authType?: number[],
  };

  declare export var Ndef: {
    TNF_EMPTY: 0x0,
    TNF_WELL_KNOWN: 0x01,
    TNF_MIME_MEDIA: 0x02,
    TNF_ABSOLUTE_URI: 0x03,
    TNF_EXTERNAL_TYPE: 0x04,
    TNF_UNKNOWN: 0x05,
    TNF_UNCHANGED: 0x06,
    TNF_RESERVED: 0x07,

    RTD_TEXT: 'T', // [0x54]
    RTD_URI: 'U', // [0x55]
    RTD_SMART_POSTER: 'Sp', // [0x53, 0x70]
    RTD_ALTERNATIVE_CARRIER: 'ac', //[0x61, 0x63]
    RTD_HANDOVER_CARRIER: 'Hc', // [0x48, 0x63]
    RTD_HANDOVER_REQUEST: 'Hr', // [0x48, 0x72]
    RTD_HANDOVER_SELECT: 'Hs', // [0x48, 0x73]

    MIME_WFA_WSC: 'application/vnd.wfa.wsc',

    text: {
      encodePayload: (
        text: string,
        lang?: ISOLangCode,
        encoding?: any,
      ) => NdefRecord,
      decodePayload: (data: Uint8Array) => string,
    },
    uri: {
      encodePayload: (uri: URI) => NdefRecord,
      decodePayload: (data: Uint8Array) => string,
    },
    wifiSimple: {
      encodePayload: (credentials: WifiSimpleCredentials) => NdefRecord,
      decodePayload: (data: Uint8Array) => WifiSimpleCredentials,
    },
    util: {
      stringToBytes: (string: string) => any[],
      bytesToString: (bytes: any) => string,
      bytesToHexString: (bytes: any) => string,
      toHex: (i: any) => any,
      toPrintable: (i: any) => string,
    },
    isType(record: NdefRecord, tnf: number, type: string): boolean,
    stringify(data: number[], separator: string): string,
    encodeMessage(records: NdefRecord[]): Uint8Array,
    decodeMessage(bytes: any[] | Buffer): NdefRecord[],
    textRecord(text: ?string, lang?: ISOLangCode, encoding?: any): NdefRecord,
    uriRecord(uri: URI, id?: any): NdefRecord,
    wifiSimpleRecord(credentials: WifiSimpleCredentials, id?: any): NdefRecord,
  };
}
