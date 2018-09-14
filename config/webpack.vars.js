'use strict'

const production = process.env.NODE_ENV === 'production'
const addAnalyzer = process.env.ANALYZER === 'true'

module.exports = {
  production,
  addAnalyzer,
  filename: (ext, prefix) => `cozy-bar${prefix ? `.${prefix}` : ''}${production ? '.min' : ''}.${ext}`
}
