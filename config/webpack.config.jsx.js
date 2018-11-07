'use strict'

module.exports = {
  resolve: {
    extensions: ['.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules\/(?!(cozy-ui))/,
        loader: 'babel-loader'
      }
    ]
  }
}
