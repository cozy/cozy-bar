'use strict'

const production = process.env.NODE_ENV === 'production'

module.exports = {
  production: production,
  filename: (ext, prefix) => `cozy-bar${prefix ? `.${prefix}` : ''}${production ? '.min' : ''}.${ext}`
}
