const PATH = require('path');
const FS = require('fs'),
  blacklist = require('metro-config/src/defaults/blacklist');

function resolvePath(...parts) {
  var thisPath = PATH.resolve.apply(PATH, parts);
  if (!FS.existsSync(thisPath)) return;

  return FS.realpathSync(thisPath);
}

function isExternalModule(modulePath) {
  return modulePath.substring(0, __dirname.length) !== __dirname;
}

function listDirectories(rootPath, cb) {
  FS.readdirSync(rootPath).forEach(fileName => {
    if (fileName.charAt(0) === '.') return;

    var fullFileName = PATH.join(rootPath, fileName),
      stats = FS.lstatSync(fullFileName),
      symbolic = false;

    if (stats.isSymbolicLink()) {
      fullFileName = resolvePath(fullFileName);
      if (!fullFileName) return;

      stats = FS.lstatSync(fullFileName);

      symbolic = true;
    }

    if (!stats.isDirectory()) return;

    var external = isExternalModule(fullFileName);
    cb({ rootPath, symbolic, external, fullFileName, fileName });
  });
}

function buildFullModuleMap(
  moduleRoot,
  mainModuleMap,
  externalModuleMap,
  _alreadyVisited,
  _prefix,
) {
  if (!moduleRoot) return;

  var alreadyVisited = _alreadyVisited || {},
    prefix = _prefix;

  if (alreadyVisited && alreadyVisited.hasOwnProperty(moduleRoot)) return;

  alreadyVisited[moduleRoot] = true;

  listDirectories(
    moduleRoot,
    ({ fileName, fullFileName, symbolic, external }) => {
      if (symbolic)
        return buildFullModuleMap(
          resolvePath(fullFileName, 'node_modules'),
          mainModuleMap,
          externalModuleMap,
          alreadyVisited,
        );

      var moduleMap = external ? externalModuleMap : mainModuleMap,
        moduleName = prefix ? PATH.join(prefix, fileName) : fileName;

      if (fileName.charAt(0) !== '@') moduleMap[moduleName] = fullFileName;
      else
        return buildFullModuleMap(
          fullFileName,
          mainModuleMap,
          externalModuleMap,
          alreadyVisited,
          fileName,
        );
    },
  );
}

function buildModuleResolutionMap() {
  var moduleMap = {},
    externalModuleMap = {
      ...require('node-libs-react-native'),
      // assert: require.resolve('assert/'),
      // buffer: require.resolve('buffer/'),
      constants: require.resolve('constants-browserify'),
      // crypto: require.resolve('react-native-crypto'),
      // events: require.resolve('events/'),
      process: require.resolve('process/browser.js'),
      'react-native': PATH.resolve(__dirname, 'node_modules/react-native'),
      //stream: require.resolve('readable-stream'),
      vm: require.resolve('vm-browserify'),
    };

  buildFullModuleMap(baseModulePath, moduleMap, externalModuleMap);

  // Root project modules take precedence over external modules
  return Object.assign({}, externalModuleMap, moduleMap);
}

function findAlernateRoots(
  moduleRoot = baseModulePath,
  alternateRoots = [],
  _alreadyVisited,
) {
  var alreadyVisited = _alreadyVisited || {};
  if (alreadyVisited && alreadyVisited.hasOwnProperty(moduleRoot)) return;

  alreadyVisited[moduleRoot] = true;

  listDirectories(moduleRoot, ({ fullFileName, fileName, external }) => {
    if (fileName.charAt(0) !== '@') {
      if (external) alternateRoots.push(fullFileName);
    } else {
      findAlernateRoots(fullFileName, alternateRoots, alreadyVisited);
    }
  });

  return alternateRoots;
}

function getPolyfillHelper() {
  var getPolyfills;

  // Get default react-native polyfills
  try {
    getPolyfills = require('react-native/rn-get-polyfills');
  } catch (e) {
    getPolyfills = () => [];
  }

  // See if project has custom polyfills, if so, include the PATH to them
  try {
    let customPolyfills = require.resolve('./polyfills.js');
    getPolyfills = (function(originalGetPolyfills) {
      return () => originalGetPolyfills().concat(customPolyfills);
    })(getPolyfills);
  } catch (e) {}

  return getPolyfills;
}

const baseModulePath = resolvePath(__dirname, 'node_modules'),
  // watch alternate roots (outside of project root)
  alternateRoots = findAlernateRoots(),
  // build full module map for proper
  // resolution of modules in external roots
  extraNodeModules = buildModuleResolutionMap();

const moduleBlacklist = alternateRoots.map(
  root =>
    new RegExp(
      PATH.join(root, 'node_modules', 'react-native').replace(
        /[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g,
        '\\$&',
      ),
    ),
);

if (alternateRoots && alternateRoots.length)
  console.log('Found alternate project roots: ', alternateRoots);

module.exports = {
  resolver: {
    blacklistRE: blacklist(moduleBlacklist),
    extraNodeModules,
  },
  watchFolders: alternateRoots,
  serializer: {
    getPolyfills: getPolyfillHelper(),
  },
};
