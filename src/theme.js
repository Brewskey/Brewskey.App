// @flow

export const COLORS = {
  accent: '#efb534',
  danger: '#ef5134',
  danger2: '#ff6b5b',
  error: '#f44336',
  primary: '#3c91a1',
  primary2: '#238393',
  primary3: '#1e717e',
  primary4: '#bfe3ea',
  secondary: '#fff',
  secondary2: '#eee',
  secondary3: '#bbb',
  success: '#71F197',
  text: '#43484d',
  textFaded: 'rgba(0, 0, 0, 0.6)',
  textInverse: '#fff',
  textInverseFaded: 'rgba(255,255,255,0.7)',
};

/* eslint-disable sorting/sort-object-props */
export const TYPOGRAPHY = {
  heading: {
    fontSize: 20,
  },
  secondary: { fontSize: 18 },
  paragraph: { fontSize: 16 },
  small: { fontSize: 14 },
};
/* eslint-enable sorting/sort-object-props */

const theme = {
  button: {
    white: {
      buttonStyle: { backgroundColor: 'white' },
      textStyle: { color: 'black' },
    },
    wide: {
      buttonStyle: { width: '100%' },
    },
  },
  deviceOnlineIndicator: {
    connectedColor: 'green',
    disconnectedColor: 'red',
  },
  tabBar: {
    tabBarOptions: {
      activeBackgroundColor: COLORS.primary3,
      inactiveBackgroundColor: COLORS.primary2,
      indicatorStyle: { backgroundColor: COLORS.secondary },
      style: { backgroundColor: COLORS.primary2 },
    },
  },
};

export default theme;
