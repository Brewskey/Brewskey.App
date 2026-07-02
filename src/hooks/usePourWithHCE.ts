import { useCallback, useRef } from 'react';

import { useCreateNfcTagAuthorization } from 'hooks/queries/NfcQueries';
import { getHCEModule } from 'services/nfc';

export interface UsePourWithHCEOptions {
  onClosed: () => void;
  onSuccess?: () => void;
}

/**
 * Hook for the pour flow using Host Card Emulation (phone as NFC card).
 * Request token from api/authorizations/nfc-tag, start HCE session, respond to reader APDUs.
 * On readerDeselected/sessionInvalidated calls onClosed (e.g. close modal).
 * NDEF Type 4 response format should align with Brewskey.Device reader (see plan align step).
 */
export function usePourWithHCE(accessToken: string | undefined) {
  const createNfcTag = useCreateNfcTagAuthorization();
  const subscriptionRef = useRef<{ remove: () => void } | null>(null);
  const optionsRef = useRef<UsePourWithHCEOptions | null>(null);

  const start = useCallback(
    async (opts: UsePourWithHCEOptions) => {
      optionsRef.current = opts;
      if (!accessToken) {
        return;
      }

      const hce = getHCEModule();
      if (!hce?.beginSession || !hce?.startHCE || !hce?.onEvent) {
        return;
      }

      try {
        const { token } = await createNfcTag.mutateAsync(accessToken);
        if (!token) {
          return;
        }

        await hce.beginSession();
        hce.setSessionAlertMessage?.('Tap Brewskey Box');
        await hce.startHCE();

        subscriptionRef.current = hce.onEvent(
          async (event: { type: string; arg: string | null }) => {
            switch (event.type) {
              case 'received': {
                // Respond with success status. TODO: Align with device reader - respond with token as NDEF Type 4.
                await hce.respondAPDU?.(null, '9000');
                break;
              }
              case 'readerDeselected':
              case 'sessionInvalidated': {
                opts.onSuccess?.();
                opts.onClosed();
                try {
                  hce.invalidateSession?.();
                } catch {
                  // ignore
                }
                subscriptionRef.current?.remove();
                subscriptionRef.current = null;
                break;
              }
              default:
                break;
            }
          },
        );
      } catch {
        opts.onClosed();
      }
    },
    [accessToken, createNfcTag],
  );

  const stop = useCallback(() => {
    const hce = getHCEModule();
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    try {
      hce?.invalidateSession?.();
    } catch {
      // ignore
    }
    optionsRef.current = null;
  }, []);

  // HCE pour is not functional yet: the APDU responder only returns 9000
  // (never the token as an NDEF Type 4 file) and the Android
  // HostApduService/apduservice.xml registration is missing. Keep the path
  // disabled so NFC support detection doesn't auto-start a broken session
  // that closes the pour modal on open.
  const HCE_POUR_ENABLED = false;
  const isSupported = HCE_POUR_ENABLED && Boolean(getHCEModule());

  return { start, stop, isSupported };
}
