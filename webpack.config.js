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
          'style-loader',
          'css-loader?importLoaders=1',
          'postcss-loader'
        ]
      },
      {
        test: /\.svg$/,
        include: /icons/,
        loader: 'url-loader'
      }
    ]
  },
  postcss: () => {
    return [
      require('postcss-import')({
        path: [path.resolve(__dirname, 'src/styles/')],
        plugins: [
          require('autoprefixer')(['last 2 versions']),
          require('postcss-discard-empty')
        ]
      }),
      require('postcss-css-variables'),
      require('postcss-discard-duplicates'),
      require('css-mqpacker'),
      require('csswring')({
        removeAllComments: true
      })
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
