'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { filename } = require('./webpack.vars.js')

module.exports = {
  resolve: {
    extensions: ['.styl']
  },
  module: {
    loaders: [
      {
        test: /\.styl$/,
        exclude: /cozy-ui\/react/,
        loader: ExtractTextPlugin.extract([
          'css-loader?importLoaders=1',
          'postcss-loader',
          'stylus-loader?paths=node_modules/cozy-ui/stylus/'
        ])
      },
      {
        test: /\.styl$/,
        include: /cozy-ui\/react/,
        loader: ExtractTextPlugin.extract([
          'css-loader?importLoaders=1&modules&localIdentName=[local]--[hash:base64:5]',
          'postcss-loader',
          'stylus-loader?paths=node_modules/cozy-ui/stylus/'
        ])
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin(filename('css'))
  ]
}
