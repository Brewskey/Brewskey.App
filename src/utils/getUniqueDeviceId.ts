import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAndroidId, getIosIdForVendorAsync } from 'expo-application';
import { Platform } from 'react-native';
import { v4 } from 'uuid';

const UNIQUE_DEVICE_ID = 'UNIQUE_DEVICE_ID';

export const getUniqueDeviceId = async (): Promise<string> => {
  let uniqueDeviceId = await AsyncStorage.getItem(UNIQUE_DEVICE_ID);

  if (!uniqueDeviceId) {
    uniqueDeviceId =
      Platform.OS === 'android'
        ? (getAndroidId() ?? v4().toString())
        : ((await getIosIdForVendorAsync()) ?? v4().toString());
    await AsyncStorage.setItem(UNIQUE_DEVICE_ID, uniqueDeviceId);
  }

  return uniqueDeviceId;
};
