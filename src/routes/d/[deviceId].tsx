import * as React from 'react';

import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Button } from 'common/buttons/Button';
import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { LoadingIndicator } from 'common/LoadingIndicator';
import { Section } from 'common/Section';
import { useAuthSession } from 'hooks/context/AuthContext';
import {
  sendPourAuthorization,
  usePourModalContext,
} from 'hooks/context/PourProcessContext';
import { useAddSnackBarMessage } from 'hooks/context/SnackBarContext';
import { useDeviceLocation, useLocationPermission } from 'hooks/useGetLocation';
import { TYPOGRAPHY } from 'theme';

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
  },
  section: {
    padding: 16,
  },
  statusText: {
    ...TYPOGRAPHY.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
});

/**
 * Deep-link target for the URL on the Brewskey Box's NFC tag
 * (https://brewskey.com/d/<deviceId>). Reached via Android App Links / the
 * Android Application Record on the tag, or iOS universal links, and
 * immediately authorizes a pour on that device for the logged-in user.
 */
const PourDeviceScreen = () => {
  const { deviceId } = useLocalSearchParams<{ deviceId: string }>();
  const router = useRouter();
  const { data: session, isLoading: isSessionLoading } = useAuthSession();
  const permissionQuery = useLocationPermission();
  const locationQuery = useDeviceLocation();
  const addSnackBarMessage = useAddSnackBarMessage();
  const { openModal } = usePourModalContext();
  const [errorText, setErrorText] = React.useState<string | null>(null);
  const attemptedRef = React.useRef(false);

  const authorize = React.useCallback(async () => {
    setErrorText(null);
    try {
      await sendPourAuthorization({
        accessToken: session?.accessToken,
        latitude: locationQuery.data?.coords.latitude ?? 0,
        longitude: locationQuery.data?.coords.longitude ?? 0,
        didAuthorizePayment: false,
        totp: '',
        deviceId: deviceId ?? '',
      });
      addSnackBarMessage({
        duration: 3000,
        style: 'success',
        content: 'You can start pouring now!',
      });
      router.replace('/');
    } catch (error) {
      setErrorText((error as Error).message);
    }
  }, [
    session?.accessToken,
    locationQuery.data,
    deviceId,
    addSnackBarMessage,
    router,
  ]);

  React.useEffect(() => {
    if (
      attemptedRef.current ||
      isSessionLoading ||
      session?.accessToken == null ||
      deviceId == null ||
      permissionQuery.isLoading ||
      locationQuery.isLoading
    ) {
      return;
    }
    attemptedRef.current = true;
    void authorize();
  }, [
    isSessionLoading,
    session?.accessToken,
    deviceId,
    permissionQuery.isLoading,
    locationQuery.isLoading,
    authorize,
  ]);

  if (!isSessionLoading && session == null) {
    return <Redirect href="/login" />;
  }

  return (
    <Container>
      <Header shouldShowBackButton testID="header-pour-device" title="Pour" />
      <Section bottomPadded innerContainerStyle={styles.section}>
        {errorText == null ? (
          <React.Fragment>
            <Text style={styles.statusText} testID="pour-device-status">
              Authorizing your pour...
            </Text>
            <LoadingIndicator activitySize="large" />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Text style={styles.statusText} testID="pour-device-error">
              {errorText}
            </Text>
            <Button
              onPress={authorize}
              style={styles.button}
              testID="button-pour-device-retry"
              title="Try Again"
            />
            <Button
              onPress={async () => {
                router.replace('/');
                await openModal();
              }}
              style={styles.button}
              testID="button-pour-device-code"
              title="Enter Code Instead"
            />
          </React.Fragment>
        )}
      </Section>
    </Container>
  );
};

export default PourDeviceScreen;
