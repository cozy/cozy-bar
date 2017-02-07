'use strict'

const path = require('path')
const merge = require('webpack-merge')
const {filename, production} = require('./webpack.vars')
const baseConfig = require('./webpack.config.base.js')
const productionConfig = require('./webpack.config.prod')
const extractConfig = require('./webpack.config.extract')

module.exports = merge(
  baseConfig,
  production ? productionConfig : {},
  extractConfig,
  {
    output: {
      filename: filename('js'),
      path: path.resolve(__dirname, '../dist')
    }
  }
)
