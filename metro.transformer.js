const upstreamTransformer = require('@expo/metro-config/babel-transformer');

module.exports.transform = async ({ src, filename, options }) => {
  if (filename.endsWith('.gml') || filename.endsWith('.xml')) {
    const moduleSource = `module.exports = ${JSON.stringify(src)};`;
    return upstreamTransformer.transform({
      src: moduleSource,
      filename: filename + '.js',
      options,
    });
  }

  return upstreamTransformer.transform({ src, filename, options });
};
