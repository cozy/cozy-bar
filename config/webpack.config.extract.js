'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { filename } = require('./webpack.vars.js')

module.exports = {
  resolve: {
    extensions: ['.styl']
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        exclude: /cozy-ui\/react/,
        loader: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: { importLoaders: 1, sourceMap: true }
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: true }
            },
            {
              loader: 'stylus-loader',
              options: { paths: 'node_modules/cozy-ui/stylus/' }
            }
          ]
        })
      },
      {
        test: /\.styl$/,
        include: /cozy-ui\/react/,
        loader: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
                modules: true,
                localIdentName: '[local]--[hash: base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: true }
            },
            {
              loader: 'stylus-loader',
              options: { paths: 'node_modules/cozy-ui/stylus/' }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin(filename('css'))
  ]
}
