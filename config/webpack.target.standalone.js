'use strict'

const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base.js')
const inlineStylesConfig = require('./webpack.config.inline-styles.js')
const {filename} = require('./webpack.vars')

module.exports = merge(baseConfig, inlineStylesConfig, {
  output: {
    filename: filename('js', 'standalone'),
    path: path.resolve(__dirname, '../dist')
  }
})
