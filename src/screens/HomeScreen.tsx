import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme';
import Button from '../common/buttons/Button';
import Container from '../common/Container';
import Header from '../common/Header';
import NearbyLocationsList from '../components/NearbyLocationsList/NearbyLocationsList';
import ErrorScreen from '../common/ErrorScreen';
import { withErrorBoundary } from '../common/ErrorBoundary';
import { HeaderSearchBar } from '../common/Header/HeaderSearchBar';
import * as Location from 'expo-location';
import { useGetNearbyLocations } from '../hooks/queries/LocationQueries';
import { useGetLocation } from '../hooks/useGetLocation';

const styles = StyleSheet.create({
  permissionText: {
    ...TYPOGRAPHY.heading,
    color: COLORS.textFaded,
    paddingBottom: 15,
    textAlign: 'center',
  },
});

export const HomeScreen = withErrorBoundary(() => {
  const [searchText, setSearchText] = React.useState<string>('');

  const { location, permission, requestPermission } = useGetLocation();

  const nearbyLocations = useGetNearbyLocations(
    {
      latitude: location?.coords.latitude ?? 0,
      longitude: location?.coords.longitude ?? 0,
    },
    { enabled: location != null },
  );

  if (permission == null) {
    return null;
  }

  return (
    <Container>
      <Header
        // rightComponent={
        //   <HeaderSearchBar
        //     onChangeText={(value) => setSearchText(value)}
        //     onClearPress={() => setSearchText('')}
        //     onClosePress={() => setSearchText('')}
        //     value={searchText}
        //   />
        // }
        title="Nearby locations"
      />
      {!permission.granted ? (
        <Container centered>
          <Text style={styles.permissionText}>
            In order to see nearby taps, we need location permissions
          </Text>
          <Button onPress={() => { void requestPermission(); }} title="Provide permissions" />
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
