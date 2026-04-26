// import Constants from 'expo-constants';

const HOST = 'https://brewskey.com';
// const HOST = 'http://10.0.2.2:2484'; // Android emulator → host machine
// const HOST = 'http://localhost:2484';

// const debuggerHost =
//   Constants.expoConfig?.hostUri || Constants.experienceUrl || '';
// const ipAddress = debuggerHost.split(':')[0];

// const HOST = `http://${ipAddress}:2485`;
export const CONFIG = {
  CDN: `${HOST}/cdn/`,
  HOST,
};
