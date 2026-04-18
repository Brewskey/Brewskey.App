import { useCallback, useEffect, useRef, useState } from 'react';

import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useCreateNfcTagAuthorization } from 'hooks/queries/NfcQueries';
import { getNfcManager } from 'services/nfc';

export type WriteNfcFlowStatus = 'instructions' | 'login' | 'writing';

export function useWriteNfcFlow() {
  const [status, setStatus] = useState<WriteNfcFlowStatus>('instructions');
  const tokenRef = useRef<string | null>(null);
  const cancelledRef = useRef(false);
  const addSnackBarMessage = useAddSnackBarMessage();
  const createNfcTag = useCreateNfcTagAuthorization();

  interface NfcManagerInstance {
    registerTagEvent?: () => Promise<void>;
    ndefHandler?: { writeNdefMessage: (p: number[]) => Promise<void> };
    cancelTechnologyRequest?: () => Promise<void>;
    unregisterTagEvent?: () => Promise<void>;
  }
  interface NdefLike {
    encodeMessage: (r: unknown[]) => number[];
    textRecord: (t: string) => unknown;
  }
  const nfc = getNfcManager() as {
    default?: NfcManagerInstance;
    Ndef?: NdefLike;
  } | null;
  const NfcManager: NfcManagerInstance | null = (nfc?.default ??
    nfc) as NfcManagerInstance | null;
  const Ndef = nfc?.Ndef ?? null;
  const isNfcSupported = Boolean(NfcManager && Ndef);

  const cleanupNfc = useCallback(async () => {
    if (!NfcManager) return;
    try {
      await NfcManager.cancelTechnologyRequest?.();
      await NfcManager.unregisterTagEvent?.();
    } catch {
      // ignore
    }
  }, [NfcManager]);

  const goToLogin = useCallback(() => {
    setStatus('login');
    tokenRef.current = null;
  }, []);

  const onLoginSuccess = useCallback(
    async (accessToken: string) => {
      if (!isNfcSupported) {
        addSnackBarMessage({
          content: 'NFC is not available on this device.',
          style: 'danger',
        });
        return;
      }
      try {
        const { token } = await createNfcTag.mutateAsync(accessToken);
        tokenRef.current = token;
        setStatus('writing');
        cancelledRef.current = false;

        await NfcManager?.registerTagEvent?.();
        await new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 300);
        });

        const requestWriteTag = async () => {
          if (cancelledRef.current || tokenRef.current == null || !Ndef) return;
          const payload = Ndef.encodeMessage([
            Ndef.textRecord(tokenRef.current),
          ]);
          try {
            await NfcManager?.ndefHandler?.writeNdefMessage(payload);
            addSnackBarMessage({
              content: "You've successfully written to your card.",
              style: 'success',
            });
          } catch {
            if (tokenRef.current != null) {
              addSnackBarMessage({
                content: "Card didn't write. Try again!",
                style: 'danger',
              });
            }
          }
          if (cancelledRef.current) return;
          await new Promise<void>((resolve) => {
            setTimeout(() => resolve(), 1000);
          });
          requestWriteTag();
        };
        requestWriteTag();
      } catch {
        addSnackBarMessage({
          content: 'There was an error getting your NFC token ready.',
          style: 'danger',
        });
      }
    },
    [isNfcSupported, addSnackBarMessage, createNfcTag, NfcManager, Ndef],
  );

  const goBackToLogin = useCallback(async () => {
    cancelledRef.current = true;
    tokenRef.current = null;
    await cleanupNfc();
    setStatus('login');
  }, [cleanupNfc]);

  useEffect(
    () => () => {
      cancelledRef.current = true;
      cleanupNfc();
    },
    [cleanupNfc],
  );

  return {
    status,
    goToLogin,
    onLoginSuccess,
    goBackToLogin,
    isNfcSupported,
    isCreatingToken: createNfcTag.isPending,
  };
}
