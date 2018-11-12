'use strict'

const webpack = require('webpack')

module.exports = {
  mode: 'production',
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'), // to compile on production mode (redux)
      __DEVELOPMENT__: false,
      __PIWIK_SITEID__: 8,
      __PIWIK_SITEID_MOBILE__: 12,
      __PIWIK_DIMENSION_ID_APP__: 1,
      __PIWIK_TRACKER_URL__: JSON.stringify('https://piwik.cozycloud.cc')
    })
  ]
}
