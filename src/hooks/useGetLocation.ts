import * as Location from 'expo-location';
import React from 'react';

export const useGetLocation = (): {
  location: Location.LocationObject | null;
  permission: Location.LocationPermissionResponse | null;
  requestPermission: () => Promise<Location.LocationPermissionResponse>;
} => {
  const [locationPermission, setLocationPermission] =
    React.useState<Location.LocationPermissionResponse | null>(null);
  const [location, setLocation] =
    React.useState<Location.LocationObject | null>(null);

  // Check permissions on mount
  React.useEffect(() => {
    const checkPermission = async () => {
      const permission = await Location.getForegroundPermissionsAsync();
      setLocationPermission(permission);
    };
    void checkPermission();
  }, []);

  React.useEffect(() => {
    if (locationPermission == null || locationPermission.status !== 'granted') {
      return;
    }

    const updateLocation = async () => {
      const locationValue = await Location.getCurrentPositionAsync();
      setLocation(locationValue);
    };
    void updateLocation();
  }, [locationPermission]);

  const requestPermission = React.useCallback(async () => {
    const result = await Location.requestForegroundPermissionsAsync();
    // Update state after requesting to ensure UI reflects the new permission status
    setLocationPermission(result);
    return result;
  }, []);

  return {
    location,
    permission: locationPermission,
    requestPermission,
  };
};
