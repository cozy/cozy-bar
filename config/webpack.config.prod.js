'use strict'

const webpack = require('webpack')

module.exports = {
  mode: 'production',
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'), // to compile on production mode (redux)
      __DEVELOPMENT__: false
    })
  ]
}
