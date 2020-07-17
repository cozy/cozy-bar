'use strict'

const path = require('path')
const merge = require('webpack-merge')
const vars = require('./webpack.vars')
const makeExtract = require('./webpack.config.extract')

module.exports = (env = {}) => {
  const { filename, production, addAnalyzer } = vars(env)
  return merge(
    require('./webpack.config.base.js'),
    addAnalyzer ? require('./webpack.config.analyzer.js') : {},
    require('./webpack.config.jsx.js'),
    require(production ? './webpack.config.prod' : './webpack.config.dev'),
    makeExtract({ filename, production }),
    {
      output: {
        filename: filename('js'),
        path: path.resolve(__dirname, '../dist')
      }
    }
  )
}
