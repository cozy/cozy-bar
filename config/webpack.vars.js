'use strict'

module.exports = env => ({
  production: env.production,
  mobile: env.mobile,
  addAnalyzer: env.analyzer,
  filename: (ext, prefix) =>
    `cozy-bar${prefix ? `.${prefix}` : ''}${
      env.production ? '.min' : ''
    }.${ext}`
})
