'use strict'

const webpack = require('webpack')

module.exports = ({ production }) => ({
  resolve: {
    extensions: ['.styl']
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        exclude: /cozy-ui\/react/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: { importLoaders: 2, sourceMap: true }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                ctx: {
                  env: production ? 'production' : 'development'
                }
              },
              sourceMap: true
            }
          },
          {
            loader: 'stylus-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        stylus: {
          use: [require('cozy-ui/stylus')()]
        }
      }
    })
  ]
})
