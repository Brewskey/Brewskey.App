// @flow

export const COLORS = {
  accent: '#efb534',
  error: '#f44336',
  outline: '#bbb',
  outline2: '#eee',
  primary: '#3c91a1',
  primary2: '#238393',
  primary3: '#1e717e',
  secondary: '#fff',
  text: '#43484d',
  textFaded: '#bdc6cf',
  textInverse: '#fff',
};

export const TYPOGRAPHY = {
  h3: {
    fontSize: 24,
    fontWeight: 'bold',
  },
};

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
};

export default theme;
