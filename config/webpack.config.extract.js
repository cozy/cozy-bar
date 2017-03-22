'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const {filename} = require('./webpack.vars')

module.exports = {
  resolve: {
    extensions: ['.styl']
  },
  module: {
    loaders: [{
      test: /\.styl$/,
      loader: ExtractTextPlugin.extract([
        'css-loader?importLoaders=1',
        'postcss-loader',
        'stylus-loader?paths=node_modules/cozy-ui/stylus/'
      ])
    }]
  },
  plugins: [
    new ExtractTextPlugin(filename('css'))
  ]
}
