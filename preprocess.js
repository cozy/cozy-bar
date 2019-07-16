const stylus = require('stylus')
const cozyStylusPlugin = require('cozy-ui/stylus')
const fs = require('fs')

const renderStylus = function(css, filename) {
  const nodeModulesPath = __dirname + '/node_modules'
  const srcPath = __dirname + '/src'
  /* const paths = [nodeModulesPath, srcPath]
  console.log(paths)
  console.log({ nodeModulesPath }) */
  //We should be able to use webpack stylus loader here
  css = css.replace(/import \'~/g, "import '")
  try {
    return stylus(css)
      .include(nodeModulesPath)
      .include(srcPath)
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
