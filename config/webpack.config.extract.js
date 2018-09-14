'use strict'

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
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
        use: [
          MiniCssExtractPlugin.loader,
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
      },
      {
        test: /\.styl$/,
        include: /cozy-ui\/react/,
        use: [
          MiniCssExtractPlugin.loader,
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
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: filename('css'),
      chunkFilename: filename('css', '[name].[id]')
    })
  ]
}
