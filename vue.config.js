const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: 'http://localhost:2000',
  },
  configureWebpack: {
    plugins: [new VuetifyLoaderPlugin(), new webpack.ContextReplacementPlugin(/moment\/locale$/, /en$/)],
  },
  pwa: {
    workboxOptions: {
      cleanupOutdatedCaches: true,
    },
    name: 'ncodr',
  },
};
