import * as Location from 'expo-location';
import { useForegroundPermissions } from 'expo-location';
import React from 'react';

export const useGetLocation = (): {
  location: Location.LocationObject | null;
  permission: Location.LocationPermissionResponse | null;
  requestPermission: () => Promise<Location.LocationPermissionResponse>;
} => {
  const [locationPermission, requestPermission] = useForegroundPermissions();
  const [location, setLocation] =
    React.useState<Location.LocationObject | null>(null);

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

  return {
    location,
    permission: locationPermission,
    requestPermission,
  };
};
