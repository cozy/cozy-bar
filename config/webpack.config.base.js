'use strict'

const path = require('path')
const webpack = require('webpack')
const pkg = require('../package.json')

const SRC_DIR = path.resolve(__dirname, '../src')

module.exports = {
  entry: path.resolve(__dirname, '../src/index'),
  output: {
    library: ['cozy', 'bar'],
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.js', '.json', '.yaml', '.jsx'],
    modules: [SRC_DIR, 'node_modules'],
    alias: {
      react: path.resolve(__dirname, 'aliases/globalReact'),
      'react-dom': path.resolve(__dirname, 'aliases/globalReactDOM')
    }
  },
  devtool: '#source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules\/(?!(cozy-ui\/react))/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/date-fns[/\\]locale$/, /(en|es|fr)/),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(pkg.version),
      __PIWIK_SITEID__: 8,
      __PIWIK_SITEID_MOBILE__: 12,
      __PIWIK_DIMENSION_ID_APP__: 1,
      __PIWIK_TRACKER_URL__: JSON.stringify('https://matomo.cozycloud.cc')
    })
  ]
}
