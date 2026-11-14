const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: require('@react-native/metro-config').default.resolver.assetExts.filter(
      (ext: string) => ext !== 'svg'
    ),
    sourceExts: [...require('@react-native/metro-config').default.resolver.sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);