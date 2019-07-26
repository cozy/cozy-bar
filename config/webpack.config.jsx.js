'use strict'

const webpack = require('webpack')

module.exports = {
  // Necessary for cozy-ui during Preact -> React apps transition
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        USE_REACT: 'true'
      }
    })
  ]
}
