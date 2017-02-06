'use strict'

const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, '../src/'),
  output: {
    library: 'cozy-bar',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js', '.svelte', '.json', '.yaml', '.css']
  },
  devtool: '#source-map',
  module: {
    loaders: [
      {
        test: /\.(svelte|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(svelte)$/,
        loader: 'svelte-loader'
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
  }
}
