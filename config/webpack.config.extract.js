'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const {filename} = require('./webpack.vars')

module.exports = {
  module: {
    loaders: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract([
        'css-loader?importLoaders=1',
        'postcss-loader'
      ])
    }]
  },
  plugins: [
    new ExtractTextPlugin(filename('css'))
  ]
}
