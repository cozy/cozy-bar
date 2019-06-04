'use strict'

const path = require('path')
const merge = require('webpack-merge')
const vars = require('./webpack.vars')

const cssConfig = vars => {
  if (vars.mobile) {
    return require('./webpack.config.inline-styles.js')(vars)
  } else {
    return require('./webpack.config.extract')(vars)
  }
}

module.exports = (env = {}) => {
  const { filename, production, addAnalyzer } = vars(env)
  const mobile = env.target === 'mobile'
  return merge(
    require('./webpack.config.base.js'),
    addAnalyzer ? require('./webpack.config.analyzer.js') : {},
    env.light ? require('./webpack.target.light.js') : {},
    require('./webpack.config.jsx.js'),
    require(production ? './webpack.config.prod' : './webpack.config.dev'),
    cssConfig({ filename, mobile, production }),
    {
      output: {
        filename: filename('js', mobile ? 'mobile' : ''),
        path: path.resolve(__dirname, '../dist')
      }
    }
  )
}
