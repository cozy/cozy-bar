'use strict'

const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      __SERVER__: JSON.stringify('http://cozy.local:8080'),
      __DEVELOPMENT__: true,
      __PIWIK_SITEID__: 8,
      __PIWIK_SITEID_MOBILE__: 12,
      __PIWIK_DIMENSION_ID_APP__: 1,
      __PIWIK_TRACKER_URL__: JSON.stringify('https://piwik.cozycloud.cc')
    })
  ]
}
