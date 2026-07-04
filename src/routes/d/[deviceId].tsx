import * as React from 'react';

import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';

import { useAuthSession } from 'hooks/context/AuthContext';
import { useAuthorizeDevicePour } from 'hooks/context/PourProcessContext';

/**
 * Deep-link target for the URL on the Brewskey Box's NFC tag
 * (https://brewskey.com/d/<deviceId>), reached via Android App Links or iOS
 * universal links. Headless: it fires the pour authorization (outcome
 * arrives as a toast) and immediately lands on the home feed — no dedicated
 * screen.
 */
const PourDeviceScreen = () => {
  const { deviceId } = useLocalSearchParams<{ deviceId: string }>();
  const router = useRouter();
  const { data: session, isLoading } = useAuthSession();
  const authorizeDevicePour = useAuthorizeDevicePour();
  const attemptedRef = React.useRef(false);

  React.useEffect(() => {
    if (isLoading || session == null || attemptedRef.current) {
      return;
    }
    attemptedRef.current = true;
    if (deviceId != null) {
      void authorizeDevicePour(deviceId);
    }
    router.replace('/');
  }, [isLoading, session, deviceId, authorizeDevicePour, router]);

  if (!isLoading && session == null) {
    return <Redirect href="/login" />;
  }

  return null;
};

export default PourDeviceScreen;
