const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const WEB_ALIASES = {
  'react-native-maps': '@teovilla/react-native-web-maps',
};

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // When bundling for web, redirect react-native-maps to the web fallback
  if (platform === 'web' && WEB_ALIASES[moduleName]) {
    return originalResolveRequest
      ? originalResolveRequest(context, WEB_ALIASES[moduleName], platform)
      : context.resolveRequest(context, WEB_ALIASES[moduleName], platform);
  }
  // Default behavior
  return originalResolveRequest
    ? originalResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
