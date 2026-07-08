// import Constants from 'expo-constants';

// EXPO_PUBLIC_API_HOST overrides the API host (inlined at bundle time).
// Used by the real-API Playwright e2e mode to point the app at the local
// Docker stack (tests/e2e-stack); production builds default to brewskey.com.
const HOST = process.env.EXPO_PUBLIC_API_HOST ?? 'https://brewskey.com';
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
