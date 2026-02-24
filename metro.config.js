const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

config.transformer.minifierConfig = {
  mangle: {
    toplevel: true,
  },
  compress: {
    drop_console: true,
    drop_debugger: true,
  },
  output: {
    comments: false,
  },
};

module.exports = config;
