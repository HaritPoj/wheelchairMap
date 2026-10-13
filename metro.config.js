const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath = require.resolve('./metro.transformer');
config.resolver.sourceExts = Array.from(
  new Set([...(config.resolver.sourceExts || []), 'gml', 'xml'])
);

module.exports = config;
