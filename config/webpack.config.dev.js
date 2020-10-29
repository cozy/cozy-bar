'use strict'

const webpack = require('webpack')

module.exports = {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true
    })
  ]
}
