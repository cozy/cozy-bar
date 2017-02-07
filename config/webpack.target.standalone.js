'use strict'

const path = require('path')
const merge = require('webpack-merge')
const {filename, production} = require('./webpack.vars')
const baseConfig = require('./webpack.config.base.js')
const productionConfig = require('./webpack.config.prod')
const inlineStylesConfig = require('./webpack.config.inline-styles.js')

module.exports = merge(
  baseConfig,
  production ? productionConfig : {},
  inlineStylesConfig,
  {
    output: {
      filename: filename('js', 'standalone'),
      path: path.resolve(__dirname, '../dist')
    }
  }
)
