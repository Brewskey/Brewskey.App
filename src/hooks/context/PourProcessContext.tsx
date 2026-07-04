import React, { useCallback, useContext, useEffect, useState } from 'react';

import { Platform } from 'react-native';

import { CONFIG } from 'config';
import { useAuthSession } from 'hooks/context/AuthContext';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useDeviceLocation, useLocationPermission } from 'hooks/useGetLocation';
import { getNfcManager } from 'services/nfc';
import { fetchJSON } from 'utils';

import type { EntityID } from '@brewskey/js-api';
import type { PropsWithChildren } from 'react';

const STANDARD_NFC_ERROR_MESSAGE =
  'Could not read the full NFC message.\nTry Again!';

interface NdefRecordLike {
  tnf: number;
  type: number[] | string;
  payload: number[];
}

interface TagEventLike {
  ndefMessage?: NdefRecordLike[];
}

/**
 * Extracts the Brewskey device id from a scanned tag's NDEF message. The
 * box's tag carries a URI record (https://brewskey.com/d/<id>); its position
 * in the message has changed across firmware versions, so search for it
 * instead of assuming a record index.
 */
export const getDeviceIdFromTag = (
  tag: TagEventLike | null | undefined,
): EntityID | undefined => {
  const records = tag?.ndefMessage;
  if (records == null || records.length === 0) {
    return undefined;
  }

  const uriRecord = records.find((record) => {
    const type = Array.isArray(record.type)
      ? String.fromCharCode(...record.type)
      : String(record.type);
    return record.tnf === 1 && type === 'U';
  });

  if (uriRecord == null) {
    throw new Error(STANDARD_NFC_ERROR_MESSAGE);
  }

  const { payload } = uriRecord;
  // First payload byte is the URI prefix code; 0 means no abbreviation.
  const tagValue = String.fromCharCode.apply(
    null,
    payload[0] === 0 ? payload.slice(1) : payload,
  );

  const index = tagValue.indexOf('d/');

  if (!tagValue.includes(CONFIG.HOST) || index < 0) {
    throw new Error(STANDARD_NFC_ERROR_MESSAGE);
  }

  const match = /\d+/.exec(tagValue.substring(index));

  if (match == null) {
    throw new Error(STANDARD_NFC_ERROR_MESSAGE);
  }

  return match[0];
};

/**
 * Waits for a single tag scan via the OS NDEF dispatch (foreground tag
 * event). Resolves with the tag, or null when NFC is unavailable.
 */
const listenForTagOnce = async (): Promise<TagEventLike | null> => {
  const nfc = getNfcManager();
  const NfcManager = nfc?.default ?? null;
  const NfcEvents = nfc?.NfcEvents ?? null;

  if (NfcManager == null || NfcEvents == null) {
    return null;
  }

  const cleanUp = () => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.setEventListener(NfcEvents.SessionClosed, null);
  };

  return new Promise((resolve, reject) => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: TagEventLike) => {
      NfcManager.unregisterTagEvent();
      cleanUp();
      resolve(tag);
    });

    NfcManager.setEventListener(
      NfcEvents.SessionClosed,
      (error?: Error | null) => {
        cleanUp();
        reject(error ?? new Error(''));
      },
    );

    NfcManager.registerTagEvent({
      alertMessage: 'Tap Brewskey Box',
      invalidateAfterFirstRead: true,
    });
  });
};

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

// Guards against rapid repeat taps (and double-delivery of the same tag
// event) hammering the pour endpoint, which rate-limits with "Too many
// pour requests". Module-level on purpose: taps can arrive through the
// deep-link route and the root-layout tag handler simultaneously.
let isPourAuthorizationInFlight = false;
let lastPourAuthorizationAt = 0;
const POUR_AUTHORIZATION_COOLDOWN_MS = 8000;

/**
 * Fire-and-forget pour authorization for a known device id (from the box's
 * NFC tag or its /d/<id> link). Reports the outcome via snackbar toasts —
 * no navigation, no dedicated screen. Repeat calls inside the cooldown
 * window are ignored silently.
 */
export const useAuthorizeDevicePour = (): ((
  deviceId: EntityID,
) => Promise<void>) => {
  const { data: session } = useAuthSession();
  const locationQuery = useDeviceLocation();
  const addSnackBarMessage = useAddSnackBarMessage();

  return useCallback(
    async (deviceId: EntityID) => {
      if (session?.accessToken == null) {
        return;
      }
      const now = Date.now();
      if (
        isPourAuthorizationInFlight ||
        now - lastPourAuthorizationAt < POUR_AUTHORIZATION_COOLDOWN_MS
      ) {
        return;
      }
      isPourAuthorizationInFlight = true;
      try {
        await sendPourAuthorization({
          accessToken: session.accessToken,
          latitude: locationQuery.data?.coords.latitude ?? 0,
          longitude: locationQuery.data?.coords.longitude ?? 0,
          didAuthorizePayment: false,
          totp: '',
          deviceId,
        });
        addSnackBarMessage({
          duration: 3000,
          style: 'success',
          content: 'You can start pouring now!',
        });
      } catch (error) {
        addSnackBarMessage({
          duration: 3000,
          style: 'danger',
          content: (error as Error).message,
        });
      } finally {
        // Errors cool down too, so tap-spam can't stack error toasts.
        lastPourAuthorizationAt = Date.now();
        isPourAuthorizationInFlight = false;
      }
    },
    [session?.accessToken, locationQuery.data, addSnackBarMessage],
  );
};

/**
 * Provider component that manages pour process state and NFC setup.
 * Uses getNfcManager() for NFC capability detection (no native NFC on web).
 */
export const PourProcessProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useState<PourProcessState>({
    isVisible: false,
    isNFCSupported: false,
    isNFCEnabled: false,
    isLoading: false,
    shouldShowPaymentScreen: false,
    hasReadTag: false,
    pourErrorText: null,
  });

  // Set up NFC support detection (via abstraction; no native NFC on web)
  useEffect(() => {
    const nfc = getNfcManager() as {
      default?: {
        start: () => Promise<void>;
        isSupported: () => Promise<boolean>;
        isEnabled: () => Promise<boolean>;
        close: () => Promise<void>;
      };
      start?: () => Promise<void>;
      isSupported?: () => Promise<boolean>;
      isEnabled?: () => Promise<boolean>;
      close?: () => Promise<void>;
    } | null;
    if (!nfc) {
      setState((prev) => ({
        ...prev,
        isNFCSupported: false,
        isNFCEnabled: false,
      }));
      return;
    }
    const NfcManager = nfc.default ?? nfc;
    const bootstrap = async () => {
      try {
        await NfcManager.start?.();
        const isSupported = (await NfcManager.isSupported?.()) ?? false;

        if (Platform.OS === 'android') {
          const isEnabled = (await NfcManager.isEnabled?.()) ?? false;
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
      } catch {
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
        void NfcManager.close?.();
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
    setState((prev) => ({
      ...prev,
      isVisible: false,
      isLoading: false,
      shouldShowPaymentScreen: false,
      hasReadTag: false,
    }));
  }, []);

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
    if (permissionQuery.isLoading || locationQuery.isLoading) {
      return;
    }

    await context.openModal();

    if (!permission?.granted) {
      addSnackBarMessage({
        duration: 3000,
        style: 'danger',
        content: "Can't get your GPS coordinates",
      });
    }

    // When NFC is available, listen for a Brewskey Box tap: read the device
    // id from the tag's NDEF message and authorize the pour directly. The
    // TOTP input stays available in the modal as the fallback.
    if (context.isNFCEnabled) {
      try {
        const tag = await listenForTagOnce();
        const deviceId = getDeviceIdFromTag(tag);

        if (deviceId != null) {
          await sendPourAuthorization({
            accessToken: session?.accessToken,
            latitude: location?.coords.latitude ?? 0,
            longitude: location?.coords.longitude ?? 0,
            didAuthorizePayment: false,
            totp: '',
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
        // Session cancellation surfaces as an empty message; keep the modal
        // open either way so the TOTP fallback remains usable.
        const message = error instanceof Error ? error.message : '';
        if (message) {
          addSnackBarMessage({
            duration: 3000,
            style: 'danger',
            content: message,
          });
        }
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

  const closeModal = useCallback(async () => {
    const nfc = getNfcManager();
    const NfcManager = nfc?.default ?? null;
    try {
      await NfcManager?.unregisterTagEvent?.();
    } catch {
      // ignore
    }
    await context.closeModal();
  }, [context]);

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
    closeModal,
    startPourAuthorization,
  };
};
