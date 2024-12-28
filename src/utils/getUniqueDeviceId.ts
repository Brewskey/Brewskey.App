import { Platform } from 'react-native';
import * as uuid from 'uuid';
import * as Application from 'expo-application';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UNIQUE_DEVICE_ID = 'UNIQUE_DEVICE_ID';

export const getUniqueDeviceId = async (): Promise<string> => {
  let uniqueDeviceId = await AsyncStorage.getItem(UNIQUE_DEVICE_ID);

  if (!uniqueDeviceId) {
    uniqueDeviceId =
      Platform.OS === 'android'
        ? Application.getAndroidId() ?? uuid.v4().toString()
        : (await Application.getIosIdForVendorAsync()) ?? uuid.v4().toString();
    await AsyncStorage.setItem(UNIQUE_DEVICE_ID, uniqueDeviceId);
  }

  return uniqueDeviceId;
};
