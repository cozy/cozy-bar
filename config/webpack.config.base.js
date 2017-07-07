'use strict'

const path = require('path')
const webpack = require('webpack')
const pkg = require('../package.json')

module.exports = {
  entry: path.resolve(__dirname, '../src/index'),
  output: {
    library: ['cozy', 'bar'],
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['', '.js', '.json', '.yaml']
  },
  devtool: '#source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.yaml$/,
        loaders: ['json-loader', 'yaml-loader']
      },
      {
        test: /\.svg$/,
        include: /icons/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(pkg.version)
    })
  ]
}
