'use strict'

const path = require('path')
const webpack = require('webpack')
const pkg = require('../package.json')

const SRC_DIR = path.resolve(__dirname, '../src')

module.exports = {
  entry: path.resolve(__dirname, '../src/index'),
  output: {
    library: ['cozy', 'bar'],
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    'react-dom': {
      amd: 'react-dom',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      root: 'ReactDOM'
    },
    'react': {
      amd: 'react',
      commonjs: 'react',
      commonjs2: 'react',
      root: 'React'
    }
  },
  resolve: {
    extensions: ['.js', '.json', '.yaml'],
    modules: [path.join(__dirname, '../node_modules'), SRC_DIR]
  },
  devtool: '#source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.yaml$/,
        loaders: ['json-loader', 'yaml-loader']
      },
      {
        test: /\.svg$/,
        include: /icons/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/date-fns[/\\]locale$/, /en/),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(pkg.version)
    })
  ]
}
