import { useEffect, useState } from 'react';

import { AppState, Linking, Platform, StyleSheet, Text } from 'react-native';

import { Button } from 'common/buttons/Button';
import { Container } from 'common/Container';
import { Header } from 'common/Header';
import { NearbyLocationsList } from 'components/NearbyLocationsList/NearbyLocationsList';
import { useGetNearbyLocations } from 'hooks/queries/LocationQueries';
import {
  useDeviceLocation,
  useLocationPermission,
  useRequestLocationPermission,
} from 'hooks/useGetLocation';
import { COLORS, TYPOGRAPHY } from 'theme';

const styles = StyleSheet.create({
  permissionText: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textFaded,
    paddingBottom: 15,
    textAlign: 'center',
  },
});

const HomeScreen = () => {
  const permissionQuery = useLocationPermission();
  const locationQuery = useDeviceLocation();
  const requestPermissionMutation = useRequestLocationPermission();

  const [didAttemptPermissionRequest, setDidAttemptPermissionRequest] =
    useState(false);

  const permission = permissionQuery.data;
  const location = locationQuery.data;

  const nearbyLocations = useGetNearbyLocations(
    {
      latitude: location?.coords.latitude ?? 0,
      longitude: location?.coords.longitude ?? 0,
    },
    {
      enabled:
        !permissionQuery.isLoading &&
        !locationQuery.isLoading &&
        permission?.granted === true &&
        location?.coords.latitude != null &&
        location.coords.longitude != null,
    },
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState !== 'active') {
        return;
      }

      void permissionQuery.refetch();
      void locationQuery.refetch();
    });

    return () => {
      subscription.remove();
    };
  }, [locationQuery, permissionQuery]);

  useEffect(() => {
    if (permission?.granted) {
      setDidAttemptPermissionRequest(false);
    }
  }, [permission?.granted]);

  if (permissionQuery.isLoading || permission == null) {
    return null;
  }

  // Android can report `canAskAgain: false` before any prompt — never send the user to Settings on
  // the first tap. Only offer Settings after we've called `requestForegroundPermissionsAsync` once
  // and the OS still won't show the dialog again (same pattern works on iOS).
  const openSettingsOnContinue =
    Platform.OS !== 'web' &&
    permission.canAskAgain === false &&
    didAttemptPermissionRequest;

  if (permission.granted && (locationQuery.isLoading || location == null)) {
    return (
      <Container>
        <Header title="Nearby locations" />
        <NearbyLocationsList
          isLoading
          nearbyLocations={undefined}
          onRefresh={() => {
            void locationQuery.refetch();
          }}
        />
      </Container>
    );
  }

  return (
    <Container>
      <Header title="Nearby locations" />
      {!permission.granted ? (
        <Container centered testID="home-permission-request">
          <Text style={styles.permissionText} testID="home-permission-text">
            In order to see nearby taps, we need location permissions
          </Text>
          <Button
            testID={
              openSettingsOnContinue
                ? 'button-open-location-settings'
                : 'button-continue-location-permissions'
            }
            title="Continue"
            onPress={async () => {
              if (openSettingsOnContinue) {
                await Linking.openSettings();
                void permissionQuery.refetch();
                return;
              }

              if (requestPermissionMutation.isPending) {
                return;
              }

              try {
                await requestPermissionMutation.mutateAsync();
              } finally {
                setDidAttemptPermissionRequest(true);
              }
            }}
          />
        </Container>
      ) : (
        <NearbyLocationsList
          isLoading={nearbyLocations.isLoading}
          nearbyLocations={nearbyLocations.data}
          onRefresh={async () => nearbyLocations.refetch()}
        />
      )}
    </Container>
  );
};

export default HomeScreen;
