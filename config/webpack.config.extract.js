'use strict'

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

module.exports = ({ filename, production }) => ({
  resolve: {
    extensions: ['.styl']
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        exclude: /cozy-ui\/react/,
        use: [
          MiniCssExtractPlugin.loader,
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
      },
      {
        test: /\.styl$/,
        include: /cozy-ui\/react/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true,
              modules: true,
              localIdentName: 'cozy-ui-bar-[local]--[hash:base64:5]'
            }
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
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: filename('css'),
      chunkFilename: filename('css', '[name].[id]')
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        stylus: {
          use: [require('cozy-ui/stylus')()]
        }
      }
    })
  ]
})
