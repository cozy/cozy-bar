const stylus = require('stylus')
const cozyStylusPlugin = require('cozy-ui/stylus')
const fs = require('fs')

const renderStylus = function(css, filename) {
  const nodeModulesPath = __dirname + '/node_modules'
  console.log({ nodeModulesPath })
  try {
    return stylus(css)
      .define('url', stylus.url({ paths: [nodeModulesPath] }))
      .include(nodeModulesPath)
      .use(cozyStylusPlugin())
      .set('filename', filename)
      .render()
  } catch (e) {
    console.log(e) // eslint-disable-line no-console
  }
}

module.exports = renderStylus

if (require.main === module) {
  const css = fs.readFileSync(process.argv[2]).toString()
  console.log(renderStylus(css, 'toto.css'))
}
