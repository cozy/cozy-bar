'use strict'

module.exports = {
  resolve: {
    extensions: ['.styl']
  },
  module: {
    loaders: [{
      test: /\.styl$/,
      loaders: [
        'style-loader',
        'css-loader?importLoaders=1',
        'postcss-loader',
        'stylus-loader?paths=node_modules/cozy-ui/stylus/'
      ]
    }]
  }
}
