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
    extensions: ['.js', '.json', '.yaml'],
    modules: [SRC_DIR, 'node_modules'],
    alias: {
      react: path.resolve(__dirname, 'aliases/globalReact'),
      'react-dom': path.resolve(__dirname, 'aliases/globalReactDOM'),
      'cozy-ui/react': 'cozy-ui/transpiled/react'
    }
  },
  devtool: '#source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.yaml$/,
        loaders: ['json-loader', 'yaml-loader']
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
    new webpack.ContextReplacementPlugin(/date-fns[/\\]locale$/, /en/),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(pkg.version)
    })
  ]
}
