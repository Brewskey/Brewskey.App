import React, { useCallback, useContext, useEffect, useState } from 'react';

import { Platform } from 'react-native';

import { CONFIG } from 'config';
import { useAuthSession } from 'hooks/context/AuthContext';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useDeviceLocation, useLocationPermission } from 'hooks/useGetLocation';
import { usePourWithHCE } from 'hooks/usePourWithHCE';
import { getNfcManager } from 'services/nfc';
import { fetchJSON } from 'utils';

import type { EntityID } from '@brewskey/js-api';
import type { PropsWithChildren } from 'react';

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

/**
 * Provider component that manages pour process state and NFC setup.
 * Uses getNfcManager() for NFC capability detection (no native NFC on web).
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

  // Set up NFC support detection (via abstraction; no native NFC on web)
  useEffect(() => {
    const nfc = getNfcManager() as {
      default?: { start: () => Promise<void>; isSupported: () => Promise<boolean>; isEnabled: () => Promise<boolean>; close: () => Promise<void> };
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
        const isSupported = await NfcManager.isSupported?.() ?? false;

        if (Platform.OS === 'android') {
          const isEnabled = await NfcManager.isEnabled?.() ?? false;
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
  const pourWithHCE = usePourWithHCE(session?.accessToken);

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

    // Start HCE (phone as card) when NFC is enabled; reader gets token and calls API
    if (context.isNFCEnabled && pourWithHCE.isSupported) {
      try {
        await pourWithHCE.start({
          onClosed: () => {
            pourWithHCE.stop();
            context.closeModal();
          },
          onSuccess: () => {
            addSnackBarMessage({
              duration: 3000,
              style: 'success',
              content: 'You can start pouring now!',
            });
          },
        });
      } catch (error) {
        addSnackBarMessage({
          duration: 3000,
          style: 'danger',
          content: (error as Error).message,
        });
        context.closeModal();
      }
    }
  }, [
    context,
    permissionQuery.isLoading,
    locationQuery.isLoading,
    permission,
    pourWithHCE,
    addSnackBarMessage,
  ]);

  const closeModal = useCallback(async () => {
    pourWithHCE.stop();
    await context.closeModal();
  }, [context, pourWithHCE]);

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
