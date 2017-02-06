'use strict'

const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base.js')
const {filename} = require('./webpack.vars')
const extractConfig = require('./webpack.config.extract')

module.exports = merge(baseConfig, extractConfig, {
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, '../dist')
  }
})
