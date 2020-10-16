'use strict'

const path = require('path')
const merge = require('webpack-merge')
const vars = require('./webpack.vars')

module.exports = (env = {}) => {
  const { filename, production, addAnalyzer } = vars(env)
  const mobile = env.target === 'mobile'
  return merge(
    require('./webpack.config.base.js'),
    addAnalyzer ? require('./webpack.config.analyzer.js') : {},
    require('./webpack.config.jsx.js'),
    require(production ? './webpack.config.prod' : './webpack.config.dev'),
    require('./webpack.config.styles.js')({ production }),
    {
      output: {
        filename: filename('js', mobile ? 'mobile' : ''),
        path: path.resolve(__dirname, '../dist')
      }
    }
  )
}
