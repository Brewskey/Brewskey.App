import React, { useCallback, useContext, useEffect, useState } from 'react';

import nullthrows from 'nullthrows';
import { Platform } from 'react-native';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';

import { CONFIG } from 'config';
import { useAuthSession } from 'hooks/context/AuthContext';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useDeviceLocation, useLocationPermission } from 'hooks/useGetLocation';
import { fetchJSON } from 'utils';

import type { EntityID } from '@brewskey/js-api';
import type { PropsWithChildren } from 'react';
import type {
  NfcError,
  RegisterTagEventOpts,
  TagEvent,
} from 'react-native-nfc-manager';

interface PourProcessState {
  isVisible: boolean;
  isNFCSupported: boolean;
  isNFCEnabled: boolean;
  isLoading: boolean;
  shouldShowPaymentScreen: boolean;
  hasReadTag: boolean;
  pourErrorText: string | null;
}

interface PourProcessContextValue {
  // State (read-only)
  isVisible: boolean;
  isNFCSupported: boolean;
  isNFCEnabled: boolean;
  isLoading: boolean;
  shouldShowPaymentScreen: boolean;
  hasReadTag: boolean;
  pourErrorText: string | null;

  // Actions
  openModal: () => Promise<void>;
  closeModal: () => Promise<void>;
  startPourAuthorization: (totp: string) => Promise<void>;
  clearError: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const PourProcessContext = React.createContext<PourProcessContextValue | null>(
  null,
);

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

  const { payload } = tag.ndefMessage[1];

  const tagValue = String.fromCharCode.apply(
    null,
    payload[0] === 0 ? payload.slice(1) : payload,
  );

  if (!tagValue.includes(CONFIG.HOST)) {
    throw new Error(STANDARD_NFC_ERROR_MESSAGE);
  }

  const index = tagValue.indexOf('d/');

  if (index < 0) {
    throw new Error(STANDARD_NFC_ERROR_MESSAGE);
  }

  const result = nullthrows(/\d+/.exec(tagValue.substring(index)));
  return result[0];
};

interface AuthPayloadParams {
  accessToken: string | undefined;
  latitude: number;
  longitude: number;
  deviceId: EntityID | undefined;
  didAuthorizePayment: boolean;
  totp: string;
}

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
      error.message.includes('API calls quota exceeded')
    ) {
      throw new Error('Too many pour requests. Try again in a minute');
    } else {
      throw new Error('An error occurred while processing pour');
    }
  }
};

const listenForTagOnce = async (
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

/**
 * Provider component that manages pour process state and NFC setup
 */
export const PourProcessProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  console.log('PourProcessProvider');
  const [state, setState] = useState<PourProcessState>({
    isVisible: false,
    isNFCSupported: false,
    isNFCEnabled: false,
    isLoading: false,
    shouldShowPaymentScreen: false,
    hasReadTag: false,
    pourErrorText: null,
  });

  // Set up NFC support detection
  useEffect(() => {
    const bootstrap = async () => {
      try {
        await NfcManager.start();
        const isSupported = await NfcManager.isSupported();

        if (Platform.OS === 'android') {
          const isEnabled = await NfcManager.isEnabled();
          setState((prev) => ({
            ...prev,
            isNFCSupported: isSupported,
            isNFCEnabled: isEnabled,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            isNFCSupported: isSupported,
            isNFCEnabled: isSupported, // iOS doesn't have separate enabled check
          }));
        }
      } catch (_) {
        setState((prev) => ({
          ...prev,
          isNFCSupported: false,
          isNFCEnabled: false,
        }));
      }
    };

    void bootstrap();
    return () => {
      try {
        void NfcManager.close();
      } catch (error) {
        console.error(error);
      }
    };
  }, []);

  const openModal = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isVisible: true,
      pourErrorText: null,
      isLoading: false,
    }));
  }, []);

  const closeModal = useCallback(async () => {
    if (state.isNFCEnabled) {
      await NfcManager.unregisterTagEvent();
      await NfcManager.cancelTechnologyRequest();
    }
    setState((prev) => ({
      ...prev,
      isVisible: false,
      isLoading: false,
      shouldShowPaymentScreen: false,
      hasReadTag: false,
    }));
  }, [state.isNFCEnabled]);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, pourErrorText: error }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, pourErrorText: null }));
  }, []);

  const startPourAuthorization = useCallback(async (_totp: string) => {
    // Base implementation - will be overridden by hook with business logic
  }, []);

  const contextValue: PourProcessContextValue = {
    // State (read-only)
    isVisible: state.isVisible,
    isNFCSupported: state.isNFCSupported,
    isNFCEnabled: state.isNFCEnabled,
    isLoading: state.isLoading,
    shouldShowPaymentScreen: state.shouldShowPaymentScreen,
    hasReadTag: state.hasReadTag,
    pourErrorText: state.pourErrorText,

    // Actions
    openModal,
    closeModal,
    startPourAuthorization,
    clearError,
    setLoading,
    setError,
  };

  return (
    <PourProcessContext.Provider value={contextValue}>
      {children}
    </PourProcessContext.Provider>
  );
};

/**
 * Hook to access pour modal context
 * Provides state and actions for managing the pour authorization flow
 *
 * @example
 * ```tsx
 * const { isVisible, openModal, closeModal, startPourAuthorization } = usePourModalContext();
 *
 * <Button onPress={() => openModal()}>Pour</Button>
 * ```
 */
export const usePourModalContext = (): PourProcessContextValue => {
  const context = useContext(PourProcessContext);
  if (!context) {
    throw new Error(
      'usePourModalContext must be used within PourProcessProvider',
    );
  }

  const { data: session } = useAuthSession();
  const permissionQuery = useLocationPermission();
  const locationQuery = useDeviceLocation();
  const location = locationQuery.data ?? null;
  const permission = permissionQuery.data ?? null;
  const addSnackBarMessage = useAddSnackBarMessage();

  const openModal = useCallback(async () => {
    // Wait for queries to resolve before proceeding
    if (permissionQuery.isLoading || locationQuery.isLoading) {
      return;
    }

    // Open the modal
    await context.openModal();

    // Check geolocation permission
    if (!permission?.granted) {
      addSnackBarMessage({
        duration: 3000,
        style: 'danger',
        content: "Can't get your GPS coordinates",
      });
    }

    // Start NFC listening if enabled
    if (context.isNFCEnabled) {
      const sendPourAuthorizationParams = {
        accessToken: session?.accessToken,
        latitude: location?.coords.latitude ?? 0,
        longitude: location?.coords.longitude ?? 0,
        didAuthorizePayment: false,
        totp: '',
      };

      try {
        await listenForTagOnce({
          alertMessage: 'Tap Brewskey Box',
          invalidateAfterFirstRead: true,
        });

        const tag = await NfcManager.getTag();
        const deviceId = await onNFCTagDiscovered(tag, context.hasReadTag);

        if (deviceId != null) {
          await sendPourAuthorization({
            ...sendPourAuthorizationParams,
            deviceId,
          });
          addSnackBarMessage({
            duration: 3000,
            style: 'success',
            content: 'You can start pouring now!',
          });
          await context.closeModal();
        }
      } catch (error) {
        addSnackBarMessage({
          duration: 3000,
          style: 'danger',
          content: (error as Error).message,
        });
        NfcManager.cancelTechnologyRequest();
      }
    }
  }, [
    context,
    permissionQuery.isLoading,
    locationQuery.isLoading,
    permission,
    location,
    session?.accessToken,
    addSnackBarMessage,
  ]);

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

      // Wait for queries to resolve before proceeding
      if (permissionQuery.isLoading || locationQuery.isLoading) {
        addSnackBarMessage({
          duration: 3000,
          style: 'danger',
          content: 'Location data is still loading. Please try again.',
        });
        return;
      }

      try {
        context.setLoading(true);
        await sendPourAuthorization({
          accessToken: session?.accessToken,
          latitude: location?.coords.latitude ?? 0,
          longitude: location?.coords.longitude ?? 0,
          didAuthorizePayment: false,
          deviceId: undefined,
          totp,
        });
        await context.closeModal();
      } catch (error) {
        context.setLoading(false);
        context.setError((error as Error).message);
      }
    },
    [
      addSnackBarMessage,
      session?.accessToken,
      location,
      permissionQuery.isLoading,
      locationQuery.isLoading,
      context,
    ],
  );

  return {
    ...context,
    openModal,
    startPourAuthorization,
  };
};
