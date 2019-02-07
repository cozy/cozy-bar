const path = require('path')

module.exports = ({ options }) => {
  let plugins = [
    require('postcss-import')({
      path: [path.resolve(__dirname, 'src/styles/')]
    }),
    require('autoprefixer')(['last 2 versions', 'not dead', 'not ie <= 11'])
  ]

  if (options.env === 'production') {
    plugins = plugins.concat([
      require('postcss-discard-empty'),
      require('postcss-discard-duplicates'),
      require('css-mqpacker'),
      require('csswring')({
        removeAllComments: true
      })
    ])
  }

  return { plugins }
}
