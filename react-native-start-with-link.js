/**
 * - check symlink in depencency and devDepency
 * - if found, generate rn-cli-config.js
 * - react-native start with rn-cli-config
 */
// https://github.com/facebook/react-native/issues/14400

/* eslint-disable */
const packageJson = require('./package.json');
const fs = require('fs');
const exec = require('child_process').execSync;
const RN_CLI_CONFIG_NAME = `rn-cli-config-with-links.js`;

main();

function main() {
  const deps = Object.keys(
    Object.assign({}, packageJson.dependencies, packageJson.devDependencies),
  );

  const symlinkPathes = getSymlinkPathes(deps);
  generateRnCliConfig(symlinkPathes, RN_CLI_CONFIG_NAME);
  runBundlerWithConfig(RN_CLI_CONFIG_NAME);
}

function getSymlinkPathes(deps) {
  const depLinks = [];
  const depPathes = [];
  deps.forEach(dep => {
    const stat = fs.lstatSync('node_modules/' + dep);
    if (stat.isSymbolicLink()) {
      depLinks.push(dep);
      depPathes.push(fs.realpathSync('node_modules/' + dep));
    }
  });

  console.log('Starting react native with symlink modules:');
  console.log(
    depLinks.map((link, i) => '   ' + link + ' -> ' + depPathes[i]).join('\n'),
  );

  return depPathes;
}

function generateRnCliConfig(symlinkPathes, configName) {
  const fileBody = `
var path = require('path');
var blacklist;
try {
  blacklist = require('metro-config/src/defaults/blacklist');
} catch(e) {
  blacklist = require('metro/src/blacklist');
}

var config = {
  watchFolders: [
    ${symlinkPathes
      .map(path => `path.resolve('${path}')`)
      .map(path => path.replace(/\\/g, '//'))}
  ],
  resolver: {
    blacklistRE: blacklist([
      ${symlinkPathes
        .map(path => path.replace(/\\/g, '//'))
        .map(
          path =>
            `/${path.replace(
              /\//g,
              '[/\\\\]',
            )}[/\\\\]node_modules[/\\\\]react-native[/\\\\].*/`,
        )}
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
`;

  fs.writeFileSync(configName, fileBody);
}

function runBundlerWithConfig(configName) {
  exec(
    `node node_modules/react-native/local-cli/cli.js start --config ../../../../${configName}`,
    { stdio: [0, 1, 2] },
  );
}
