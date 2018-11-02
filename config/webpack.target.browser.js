'use strict'

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const {filename, production, addAnalyzer} = require('./webpack.vars')

module.exports = merge(
  require('./webpack.config.base.js'),
  addAnalyzer ? require('./webpack.config.analyzer.js') : {},
  require('./webpack.config.preact.js'),
  require(production ? './webpack.config.prod' : './webpack.config.dev'),
  require('./webpack.config.extract'),
  {
    output: {
      filename: filename('js'),
      path: path.resolve(__dirname, '../dist')
    },
    plugins: [
      new webpack.DefinePlugin({
        __TARGET__: JSON.stringify('browser')
      })
    ],
    externals: {
      React: 'React'
    }
  }
)
