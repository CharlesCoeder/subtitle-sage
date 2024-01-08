// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
    assetPlugins: transformer.assetPlugins,
  };
  config.resolver = {
    ...resolver,
    assetExts: [...resolver.assetExts.filter((ext) => ext !== "svg"), "gz", "svg"],
    sourceExts: [...resolver.sourceExts, "svg"],
    extraNodeModules: {
      ...resolver.extraNodeModules,
      path: require.resolve('react-native-path'),
    },
  };

  return config;
})();
