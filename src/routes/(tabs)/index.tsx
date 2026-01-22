import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../theme';
import Button from '../../common/buttons/Button';
import Container from '../../common/Container';
import Header from '../../common/Header';
import NearbyLocationsList from '../../components/NearbyLocationsList/NearbyLocationsList';
import ErrorScreen from '../../common/ErrorScreen';
import { withErrorBoundary } from '../../common/ErrorBoundary';
import { useGetNearbyLocations } from '../../hooks/queries/LocationQueries';
import {
  useLocationPermission,
  useDeviceLocation,
  useRequestLocationPermission,
} from '../../hooks/useGetLocation';

const styles = StyleSheet.create({
  permissionText: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textFaded,
    paddingBottom: 15,
    textAlign: 'center',
  },
});

const HomeScreen = withErrorBoundary(() => {
  const [searchText, setSearchText] = React.useState<string>('');

  const permissionQuery = useLocationPermission();
  const locationQuery = useDeviceLocation();
  const requestPermissionMutation = useRequestLocationPermission();

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
        location != null &&
        location.coords.latitude != null &&
        location.coords.longitude != null,
    },
  );

  // Wait for permission query to resolve
  if (permissionQuery.isLoading || permission == null) {
    return null;
  }

  // If permission is granted, wait for location query to resolve before showing nearby locations
  if (permission.granted && (locationQuery.isLoading || location == null)) {
    return (
      <Container>
        <Header title="Nearby locations" />
        <NearbyLocationsList
          isLoading={true}
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
            onPress={() => {
              void requestPermissionMutation.mutateAsync();
            }}
            testID="button-provide-permissions"
            title="Provide permissions"
          />
        </Container>
      ) : (
        <NearbyLocationsList
          isLoading={nearbyLocations.isLoading}
          nearbyLocations={nearbyLocations.data}
          onRefresh={() => nearbyLocations.refetch()}
        />
      )}
    </Container>
  );
}, ErrorScreen);

export default HomeScreen;
