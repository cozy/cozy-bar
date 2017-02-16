'use strict'

const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      __SERVER__: JSON.stringify('http://cozy.local:8080')
    })
  ]
}
