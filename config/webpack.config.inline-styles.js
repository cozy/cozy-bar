'use strict'

const webpack = require('webpack')
const path = require('path')

module.exports = {
  resolve: {
    extensions: ['.styl']
  },
  module: {
    rules: [{
      test: /\.styl$/,
      use: [
        {
          loader: 'style-loader',
          options: { sourceMap: true }
        },
        {
          loader: 'css-loader',
          options: { importLoaders: 1, sourceMap: true }
        },
        {
          loader: 'postcss-loader',
          options: {
            config: {
              path: path.join(__dirname, '../postcss.config.js')
            },
            sourceMap: true
          }
        },
        {
          loader: 'stylus-loader'
        }
      ]
    }]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        stylus: {
          use: [ require('cozy-ui/stylus')() ]
        }
      }
    })
  ]
}
