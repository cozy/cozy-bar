'use strict'

const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/index'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cozy-bar.js',
    library: 'cozy-bar',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js', '.css', '.html', '.svelte']
  },
  devtool: '#cheap-module-source-map',
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
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader',
          'postcss'
        ]
      },
      {
        test: /\.(html|svelte)$/,
        exclude: /node_modules/,
        loaders: ['babel-loader', 'svelte-loader']
      }
    ]
  }
}
