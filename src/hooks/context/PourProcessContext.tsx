import React, { PropsWithChildren, useCallback, useContext } from 'react';
import type { EntityID } from '@brewskey/js-api';

import { Platform } from 'react-native';
import nullthrows from 'nullthrows';
import { fetchJSON } from '../../utils';
import CONFIG from '../../config';
import { useGetLocation } from '../useGetLocation';
import { useAddSnackBarMessage } from './SnackBarContext';
import NfcManager, {
  NfcAdapter,
  NfcError,
  NfcEvents,
  NfcTech,
  RegisterTagEventOpts,
  TagEvent,
} from 'react-native-nfc-manager';
import { useAuthContext } from './AuthContext';

type PourProcessData = {
  isVisible: boolean;
  isNFCSupported: boolean;
  isNFCEnabled: boolean;
  isLoading: boolean;
  shouldShowPaymentScreen: false;
  hasReadTag: boolean;
  pourErrorText: string | null;
};

type PourProcessContextType = [
  PourProcessData,
  (data: PourProcessData) => void,
];

const PourProcessContext = React.createContext<PourProcessContextType>(
  [] as unknown as PourProcessContextType,
);

export const PourProcessProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [contextData, setContextData] = React.useState<PourProcessData>({
    isVisible: false,
    isNFCSupported: false,
    isNFCEnabled: false,
    isLoading: false,
    shouldShowPaymentScreen: false,
    hasReadTag: false,
    pourErrorText: null,
  });

  // Set up NFC
  React.useEffect(() => {
    const bootstrap = async () => {
      try {
        await NfcManager.start();

        if (Platform.OS === 'android') {
          setContextData({
            ...contextData,
            isNFCEnabled: await NfcManager.isEnabled(),
          });
        } else {
          setContextData({
            ...contextData,
            isNFCEnabled: contextData.isNFCSupported,
          });
        }
      } catch (_) {
        setContextData({
          ...contextData,
          isNFCSupported: false,
          isNFCEnabled: false,
        });
      }
    };

    void bootstrap();
    return () => {
      void NfcManager.close();
    };
  }, []);

  return (
    <PourProcessContext.Provider value={[contextData, setContextData]}>
      {children}
    </PourProcessContext.Provider>
  );
};

const STANDARD_NFC_ERROR_MESSAGE =
  'Could not read the full NFC message.\nTry Again!';

const onNFCTagDiscovered = (
  tag: TagEvent | null,
  hasReadTag: boolean,
): EntityID | undefined => {
  if (tag == null) {
    return undefined;
  }

  if (hasReadTag) {
    return undefined;
  }

  // this._hasReadTag = true;
  const { payload } = tag.ndefMessage[1];
  // if (tag.ndefMessage) {
  //   // eslint-disable-next-line prefer-destructuring
  //   payload = tag.ndefMessage[1].payload;
  // } else if (tag.length) {
  //   if (!tag[1].payload[0]) {
  //     tag[1].payload.shift();
  //   }

  //   // eslint-disable-next-line prefer-destructuring
  //   payload = tag[1].payload;
  // } else {
  //   this._showBadScan();
  //   return;
  // }

  const tagValue = String.fromCharCode.apply(
    null,
    payload[0] === 0 ? payload.slice(1) : payload,
  );

  if (tagValue.indexOf(CONFIG.HOST) < 0) {
    throw new Error(STANDARD_NFC_ERROR_MESSAGE);
  }

  const index = tagValue.indexOf('d/');

  if (index < 0) {
    throw new Error(STANDARD_NFC_ERROR_MESSAGE);
  }

  const result = nullthrows(tagValue.substring(index).match(/\d+/));
  return result[0];
  // this._processPour();
};

type AuthPayloadParams = {
  accessToken: string | undefined;
  latitude: number;
  longitude: number;
  deviceId: EntityID | undefined;
  didAuthorizePayment: boolean;
  totp: string;
};

export const sendPourAuthorization = async (
  authPayloadParams: AuthPayloadParams,
): Promise<void> => {
  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${authPayloadParams?.accessToken ?? ''}`,
    'Content-Type': 'application/json',
  } as const;

  const body = JSON.stringify(authPayloadParams);

  const payload = {
    body,
    headers,
    method: 'POST',
  };

  try {
    await fetchJSON(`${CONFIG.HOST}/api/authorizations/pour/`, payload);
  } catch (error) {
    if (!authPayloadParams.deviceId) {
      throw new Error(
        'The passcode you entered was incorrect or expired. Please try a new code.',
      );
    } else if (
      error instanceof Error &&
      error.message.indexOf('API calls quota exceeded') >= 0
    ) {
      throw new Error('Too many pour requests. Try again in a minute');
    } else {
      throw new Error('An error occurred while processing pour');
    }
  }
};

const listenForTagOnce = (
  options?: RegisterTagEventOpts,
): Promise<TagEvent> => {
  const cleanUp = () => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.setEventListener(NfcEvents.SessionClosed, null);
  };

  return new Promise((resolve, reject) => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: TagEvent) => {
      console.log(tag);
      NfcManager.unregisterTagEvent();
      cleanUp();
      resolve(tag);
    });

    NfcManager.setEventListener(
      NfcEvents.SessionClosed,
      (error?: NfcError.NfcErrorBase) => {
        console.log('closed');
        cleanUp();
        reject(error);
      },
    );

    NfcManager.registerTagEvent(options);
  });
};

export const usePourModalContext = (): PourProcessData & {
  setVisibility: (isVisible: boolean) => void;
  startPourAuthorization: (totp: string) => void;
  setContextData: (data: Partial<PourProcessData>) => void;
} => {
  const [session] = useAuthContext();
  const [contextData, setContextData] = useContext(PourProcessContext);
  const { location, permission } = useGetLocation();
  const addSnackBarMessage = useAddSnackBarMessage();

  const setVisibility = useCallback(
    async (isVisible: boolean) => {
      if (isVisible) {
        setContextData({
          ...contextData,
          isVisible: true,
          pourErrorText: null,
          isLoading: false,
        });
        if (contextData.isNFCEnabled) {
          const sendPourAuthorizationParams = {
            accessToken: session?.accessToken,
            latitude: location?.coords.latitude ?? 0,
            longitude: location?.coords.latitude ?? 0,
            didAuthorizePayment: false,
            totp: '',
          };
          await listenForTagOnce({
            alertMessage: 'Tap Brewskey Box',
            invalidateAfterFirstRead: true,
            // isReaderModeEnabled: true,
            // readerModeFlags:
            //   NfcAdapter.FLAG_READER_NFC_A |
            //   NfcAdapter.FLAG_READER_NFC_B |
            //   NfcAdapter.FLAG_READER_NFC_F |
            //   NfcAdapter.FLAG_READER_NFC_V, // & NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK,
          })
            .then(() => NfcManager.getTag())
            .then(async (tag) => {
              const deviceId = await onNFCTagDiscovered(
                tag,
                contextData.hasReadTag,
              );

              if (deviceId == null) {
                return;
              }

              setContextData({
                ...contextData,
                hasReadTag: true,
              });
              await sendPourAuthorization({
                ...sendPourAuthorizationParams,
                deviceId,
              });
              addSnackBarMessage({
                duration: 3000,
                style: 'success',
                content: 'You can start pouring now!',
              });
              setVisibility(false);
            })
            .catch((error: Error) => {
              addSnackBarMessage({
                duration: 3000,
                style: 'danger',
                content: error.message,
              });
              NfcManager.cancelTechnologyRequest();
            });
        }
        // check geolocation
        if (permission == null || permission.granted === false) {
          addSnackBarMessage({
            duration: 3000,
            style: 'danger',
            content: "Can't get your GPS coordinates",
          });
        }
        setContextData({
          ...contextData,
          pourErrorText: null,
          isLoading: false,
          isVisible,
        });
        return;
      }

      if (contextData.isNFCEnabled) {
        await NfcManager.unregisterTagEvent();
        await NfcManager.cancelTechnologyRequest();
      }

      setContextData({
        ...contextData,
        isLoading: false,
        shouldShowPaymentScreen: false,
        hasReadTag: false,
        isVisible,
      });
    },
    [contextData, setContextData],
  );

  const startPourAuthorization = useCallback(
    async (totp: string) => {
      if (totp.length !== 6) {
        addSnackBarMessage({
          duration: 3000,
          style: 'danger',
          content: 'Invalid code',
        });
        return;
      }

      try {
        setContextData({
          ...contextData,
          isLoading: true,
        });
        await sendPourAuthorization({
          accessToken: session?.accessToken,
          latitude: location?.coords.latitude ?? 0,
          longitude: location?.coords.latitude ?? 0,
          didAuthorizePayment: false,
          deviceId: undefined,
          totp,
        });
        setVisibility(false);
      } catch (error) {
        setContextData({
          ...contextData,
          isLoading: false,
          pourErrorText: (error as Error).message,
        });
      }
    },
    [
      addSnackBarMessage,
      session,
      location,
      setContextData,
      contextData,
      setVisibility,
    ],
  );

  return {
    ...contextData,
    setVisibility,
    startPourAuthorization,
    setContextData: (data) =>
      setContextData({
        ...contextData,
        ...data,
      }),
  };
};
