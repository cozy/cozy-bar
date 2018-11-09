// Check for global React or load dependency
const ReactBundled = require('react')
const ReactDOMBundled = require('react-dom')

if (!window.React || !window.ReactDOM) {
  console.info(
    'CozyBar: No react related frameworks found, the bar will use its own ones.'
  )
  window.React = ReactBundled
  window.ReactDOM = ReactDOMBundled
}
