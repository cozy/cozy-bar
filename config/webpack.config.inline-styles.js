'use strict'

module.exports = {
  resolve: {
    extensions: ['.styl']
  },
  module: {
    rules: [{
      test: /\.styl$/,
      use: [
        {
          loader: 'style-loader',
          options: { sourceMap: true }
        },
        {
          loader: 'css-loader',
          options: { importLoaders: 1, sourceMap: true }
        },
        {
          loader: 'postcss-loader',
          options: { sourceMap: true }
        },
        {
          loader: 'stylus-loader',
          options: { paths: 'node_modules/cozy-ui/stylus/' }
        }
      ]
    }]
  }
}
