'use strict'

const path = require('path')
const merge = require('webpack-merge')

const vars = require('./config/webpack.vars')
const makeExtract = require('./config/webpack.config.extract')
const base = require('./config/webpack.config.base.js')
const analyzer = require('./config/webpack.config.analyzer.js')
const jsx = require('./config/webpack.config.jsx.js')

module.exports = (env = {}) => {
  const { filename, production, addAnalyzer } = vars(env)
  return merge(
    base,
    addAnalyzer ? analyzer : {},
    jsx,
    require(production
      ? './config/webpack.config.prod'
      : './config/webpack.config.dev'),
    makeExtract({ filename, production }),
    {
      output: {
        filename: filename('js'),
        path: path.resolve(__dirname, './dist')
      }
    }
  )
}
