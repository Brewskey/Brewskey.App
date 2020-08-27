
var path = require('path');
var blacklist;
try {
  blacklist = require('metro-config/src/defaults/blacklist');
} catch(e) {
  blacklist = require('metro/src/blacklist');
}

var config = {
  watchFolders: [
    path.resolve('H://dev//mine//Brewskey//brewksey.js-api')
  ],
  resolver: {
    blacklistRE: blacklist([
      /H:[\/\\][\/\\]dev[\/\\][\/\\]mine[\/\\][\/\\]Brewskey[\/\\][\/\\]brewksey.js-api[\/\\]node_modules[\/\\]react-native[\/\\].*/
    ]),
    extraNodeModules: {
      'assert': require.resolve('assert/'),
      'buffer': require.resolve('buffer/'),
      'constants': require.resolve('constants-browserify'),
      'crypto': require.resolve('react-native-crypto'),
      'events': require.resolve('events/'),
      'process': require.resolve('process/browser.js'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
      'stream': require.resolve('readable-stream'),
      'vm': require.resolve('vm-browserify')
    },
  },
};
module.exports = config;
