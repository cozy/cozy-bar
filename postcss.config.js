const path = require('path')

const { production } = require('./config/webpack.vars')

const commons = [
  require('postcss-import')({
    path: [path.resolve(__dirname, 'src/styles/')],
    plugins: production ? [
      require('autoprefixer')(['last 2 versions']),
      require('postcss-discard-empty')
    ] : []
  }),
  require('postcss-css-variables')
]

module.exports = {
  plugins: production ? commons.concat([
    require('postcss-discard-duplicates'),
    require('css-mqpacker'),
    require('csswring')({
      removeAllComments: true
    })
  ]) : commons
}
