if (!window.React) {
  throw new Error(
    'React must be globally set on window for the cozy-bar to use it'
  )
}

module.exports = window.React || require('my-react')
