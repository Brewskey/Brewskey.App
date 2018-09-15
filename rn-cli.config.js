
var path = require('path');
var blacklist;
try {
  blacklist = require('metro-bundler/src/blacklist');
} catch(e) {
  blacklist = require('metro/src/blacklist');
}

var config = {
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
  getBlacklistRE() {
    return blacklist([
      
    ]);
  },
  getProjectRoots() {
    return [
      // Keep your project directory.
      path.resolve(__dirname),

      // Include your forked package as a new root.
      
    ];
  }
};
module.exports = config;
  