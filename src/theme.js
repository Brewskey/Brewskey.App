// @flow

export const COLORS = {
  accent: '#efb534',
  danger: '#ef5134',
  error: '#f44336',
  primary: '#3c91a1',
  primary2: '#238393',
  primary3: '#1e717e',
  secondary: '#fff',
  secondary2: '#eee',
  secondary3: '#bbb',
  text: '#43484d',
  textFaded: '#bdc6cf',
  textInverse: '#fff',
};

/* eslint-disable sorting/sort-object-props */
export const TYPOGRAPHY = {
  heading: {
    fontSize: 20,
  },
  secondary: { fontSize: 18 },
  paragraph: { fontSize: 16 },
  small: {},
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
