'use strict'

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const build = process.env.NODE_ENV === 'production'

const base = {
  entry: path.resolve(__dirname, 'src/index'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cozy-bar.js',
    library: 'cozy-bar',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['', '.js', '.html', '.svelte', '.json', '.yaml', '.css']
  },
  devtool: '#cheap-module-source-map',
  module: {
    loaders: [
      {
        test: /\.(svelte|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(svelte)$/,
        exclude: /node_modules/,
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
        test: /\.(css)$/,
        loaders: [
          'style-loader?singleton',
          'css-loader?importLoaders=1&minimize=true',
          'postcss-loader'
        ]
      },
      {
        test: /\.svg$/,
        include: /icons/,
        loader: 'url-loader'
      }
    ]
  }
}

if (build) {
  module.exports = merge(base, {
    plugins: [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        compress: {
          warnings: false
        }
      }),
      new webpack.DefinePlugin({
        __SERVER__: false,
        __DEVELOPMENT__: false,
        __DEVTOOLS__: false
      })
    ]
  })
} else {
  module.exports = base
}
