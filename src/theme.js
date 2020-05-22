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
  secondaryDisabled: 'rgba(255,255,255,0.2)',
  success: '#71F197',
  text: '#43484d',
  textFaded: 'rgba(0, 0, 0, 0.4)',
  textInput: '#86939e',
  textInputPlaceholder: '#bdc6cf',
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

type ElevationStyle = {|
  elevation: number,
  shadowOffset: {| height: number |},
  shadowOpacity: number,
  shadowRadius: number,
|};

// for full effect on android we probably have to set elevation
// prop to the <View /> itself and it also will affect zIndex  and
// for elevation level > 1 drops more big shadows
// but since we never use high elevation this is not really necessary
export const getElevationStyle: (number) => ElevationStyle = (
  elevation: number,
) => ({
  elevation,
  shadowOffset: {
    height: 0.6 * elevation,
  },
  shadowOpacity: 0.0015 * elevation + 0.18,
  shadowRadius: 0.54 * elevation,
});

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
      activeTintColor: COLORS.secondary,
      inactiveTintColor: COLORS.textInverseFaded,
      indicatorStyle: { backgroundColor: COLORS.secondary },
      style: { backgroundColor: COLORS.primary2 },
    },
  },
};

export default theme;
