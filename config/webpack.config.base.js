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
      },
      {
        test: /\.svg$/,
        include: /icons/,
        exclude: /node_modules/,
        loader: 'url-loader'
      },
      {
        test: /\.svg$/,
        include: /sprites/,
        exclude: /node_modules/,
        loader: 'svg-sprite-loader'
      },
      {
        test: /\.svg$/,
        include: /cozy-ui/,
        loader: 'svg-sprite-loader'
      }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/date-fns[/\\]locale$/, /(en|es|fr)/),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(pkg.version)
    })
  ]
}
