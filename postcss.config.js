const path = require('path')

module.exports = {
  plugins: [
    require('postcss-import')({
      path: [path.resolve(__dirname, 'src/styles/')],
      plugins: [
        require('autoprefixer')(['last 2 versions']),
        require('postcss-discard-empty')
      ]
    }),
    require('postcss-css-variables'),
    require('postcss-discard-duplicates'),
    require('css-mqpacker'),
    require('csswring')({
      removeAllComments: true
    })
  ]
}
