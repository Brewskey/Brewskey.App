const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const ALIASES = {
  'react-native-maps': '@teovilla/react-native-web-maps',
};

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // When bundling for web, redirect react-native-maps to the web fallback
  if (platform === 'web' && ALIASES[moduleName]) {
    return originalResolveRequest
      ? originalResolveRequest(context, ALIASES[moduleName], platform)
      : context.resolveRequest(context, ALIASES[moduleName], platform);
  }
  // Default behavior for other platforms
  return originalResolveRequest
    ? originalResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
