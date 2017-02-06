'use strict'

module.exports = {
  module: {
    loaders: [{
      test: /\.css$/,
      loaders: [
        'style-loader',
        'css-loader?importLoaders=1',
        'postcss-loader'
      ]
    }]
  }
}
