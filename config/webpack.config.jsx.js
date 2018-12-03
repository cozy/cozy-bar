'use strict'

const webpack = require('webpack')

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
  },
  // Necessary for cozy-ui during Preact -> React apps transition
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        USE_REACT: 'true'
      }
    })
  ]
}
